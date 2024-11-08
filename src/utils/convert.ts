import jscodeshift from "jscodeshift";
import type { JSCodeshift } from "jscodeshift";
const j = jscodeshift.withParser("ts");
let classPaths: any = {};

function getPriority(node: any) {
  if (node.type === "ClassProperty") {
    if (node.static) {
      return 1;
    }
    return 2;
  }

  if (node.type === "MethodDefinition") {
    if (node.key.name === "constructor") {
      return 11;
    }
    if (node.static) {
      return 12;
    }
    return 13;
  }

  return 100;
}

function createMethodDefinition(
  j: JSCodeshift,
  kind: "constructor" | "method" | "get" | "set",
  key: any,
  path: any,
  isStatic = false
) {
  return j.methodDefinition(
    kind,
    key,
    j.functionExpression(null, path.params, path.body),
    isStatic
  );
}

function addMethodToClass(path: any, isStatic: boolean) {
  const { name: className } = isStatic
    ? path.value.left.object
    : path.value.left.object.object;
  const classPath = classPaths[className];
  if (!classPath) {
    return false;
  }
  const { property: methodName } = path.value.left;
  const { body: classBody } = classPath.value.body;
  if (!classBody) {
    return false;
  }
  classBody.push(
    j.methodDefinition(
      "method",
      methodName,
      j.functionExpression(
        null,
        path.value.right.params,
        path.value.right.body
      ),
      isStatic
    )
  );
  j(path).remove();
}

export default function transformer(source: string) {
  const root = j(source);
  classPaths = {};
  /*
   * Transform to create Class
   */
  root
    .find(j.FunctionDeclaration, {
      id: {
        type: "Identifier",
      },
    })
    .forEach((path: any) => {
      const className = path.value.id.name;
      if (!/^[A-Z]/.test(className))  {
        return false; 
      }
      j(path).replaceWith(
        j.classDeclaration(
          path.value.id,
          j.classBody([
            createMethodDefinition(
              j,
              "method",
              j.identifier("constructor"),
              path.value
            ),
          ])
        )
      );
      
      // Store path for future ref to insert methods
      classPaths[className] = path;
    });

  /*
   * Transform prototype variables into class constructor
   */
  root
    .find(j.ExpressionStatement, {
      expression: {
        left: {
          type: "MemberExpression",
          object: {
            property: {
              name: "prototype",
            },
          },
        },
        right: {
          type: "Literal",
        },
      },
    })
    .forEach((path: any) => {
      const { name: className } = path.value.expression.left.object.object;
      const { name: memberName } = path.value.expression.left.property;
      const { value: memberValue } = path.value.expression.right;
      // Fetch previously stored class path to find constructor
      const classPath = classPaths[className];
      if (!classPath) {
        return false;
      }
      j(classPath)
        .find(j.MethodDefinition, {
          key: {
            type: "Identifier",
            name: "constructor",
          },
        })
        .forEach((path: any) => {
          const { body: constructorBody } = path.value.value.body;
          constructorBody.push(
            j.expressionStatement(
              j.assignmentExpression(
                "=",
                j.memberExpression(
                  j.thisExpression(),
                  j.identifier(memberName)
                ),
                j.literal(memberValue)
              )
            )
          );
        });
      j(path).remove();
    });

  /*
   * Transform to create class methods based on "prototype"
   */

  root
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        object: {
          property: {
            name: "prototype",
          },
        },
      },
      operator: "=",
      right: {
        type: "FunctionExpression",
      },
    })
    .forEach((path) => {
      addMethodToClass(path, false);
    });

  /*
   * Transform to create "static" class property
   */
  root
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        property: {
          type: "Identifier",
        },
      },
      operator: "=",
    })
    .forEach((path: any) => {
      const leftObject = path.value.left.object;
      if (path.value.right.type === "FunctionExpression") {
        return false;
      }
      if (!leftObject) {
        return false;
      }
      if (leftObject.type === "ThisExpression") {
        return false;
      }
      const isProto = leftObject.property?.name === "prototype";
      const { name: className } = isProto ? leftObject.object : leftObject;
      const classPath = classPaths[className];
      if (!classPath) {
        return false;
      }
      const { body: classBody } = classPath.value.body;
      const key = path.value.left.property.name;
      const value = path.value.right;
      classBody.push(
        j.classProperty(
          j.identifier(key),
          value,
          null,
          !isProto // 静态属性
        )
      );
      j(path).remove();
    });

  /*
   *  Transform to create "static" class methods
   */
  root
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        property: {
          type: "Identifier",
        },
      },
      right: {
        type: "FunctionExpression",
      },
    })
    .forEach((path: any) => {
      const leftObject = path.value.left.object;
      if (!leftObject) {
        return false;
      }
      if (leftObject.type === "ThisExpression") {
        return false;
      }
      addMethodToClass(path, true);
    });

  /*
    Transform for getters, setters
  */
  root
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "Object",
        },
        property: {
          type: "Identifier",
          name: "defineProperty",
        },
      },
    })
    .forEach((path: any) => {
      const { name: className } = path.value.arguments[0].object;
      // Fetch previously stored class path to insert methods
      const classPath = classPaths[className];
      const { body: classBody } = classPath.value.body;
      const { value: methodName } = path.value.arguments[1];
      const { properties } = path.value.arguments[2];
      properties.forEach((property: any) => {
        // Type of method => (get || set)
        const { name: type } = property.key;
        classBody.push(
          createMethodDefinition(
            j,
            type,
            j.identifier(methodName),
            property.value
          )
        );
      });
      j(path).remove();
    });

  // 排序
  (root as any).__paths[0].value.program.body[0].body.body.sort(
    (a: any, b: any) => {
      return getPriority(a) - getPriority(b);
    }
  );

  return root.toSource();
}
