import "./styles/index.css";
import localforage from "localforage";
import { processContent } from "./utils/transform";
import {
  addContainer,
  addEditorIntoManageList,
  createEditorContainer,
  createEditorInstance,
  createEditorModel,
} from "./mirror";

const codeFunctionn2Class = `function Test() {
  this.a = 1;
  this.b = 2;
  this.inner = function inner() {}
}
Test.title ="Test";
Test.prototype.number = 0;
Test.min = function (a: number, b: number) {
  return Math.min(a,b)
}
Test.prototype.add = function(a: number, b: number) {
  return a + b;
}
`;

const $container2 = createEditorContainer();
const $container1 = createEditorContainer();
const editor1 = createEditorInstance($container1, createEditorModel(""));
const editor2 = createEditorInstance($container2, createEditorModel("")); // 第二个编辑器为只读

async function save() {
  const value1 = editor1.state.doc.toString();
  await localforage.setItem('code', value1);
  console.log("\t[INFO]\t" + "Save Success");
}

async function fetch() {
  console.log("fetch");
  await localforage.getItem('code').then((value) => {
    editor1.setState(
      createEditorModel((value as string) || codeFunctionn2Class)
    );
  });
  console.log("\t[INFO]\t" + "Fetch Success");
}

async function transform() {
  const value1 = editor1.state.doc.toString();
  console.log(value1);
  try {
    const [value, flag] = await processContent(value1);
    editor2.setState(createEditorModel(value));
    if (flag === "unrealized") {
      console.log("\t[WARN]\t" + "Format Unrealized");
    }
    if (flag === "success") {
      console.log("\t[INFO]\t" + "Format Success");
    }
  } catch (error: any) {
    editor2.setState(createEditorModel(""));
    console.log("\t[Error]\t" + error.message);
  }
}

async function onWindowLoad() {
  console.log("onWindowLoad");
  addEditorIntoManageList(editor1);
  addEditorIntoManageList(editor2);
  addContainer(
    document.getElementById("editor-double") as HTMLElement,
    $container1
  );
  addContainer(
    document.getElementById("editor-double") as HTMLElement,
    $container2
  );
  const $save = document.getElementById("save") as HTMLElement;
  $save?.addEventListener("click", save);
  const $transform = document.getElementById("transform") as HTMLElement;
  $transform?.addEventListener("click", transform);
  await fetch();
  transform();
}

window.addEventListener("load", () => onWindowLoad());
