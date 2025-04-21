import "./styles/index.css";
import "./styles/app.css";
import localforage from "localforage";
import { processContent } from "./utils/transform";
import {
  addContainer,
  addEditorIntoManageList,
  createEditorContainer,
  createEditorInstance,
  createEditorModel,
} from "./editor/index";

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
const model1 = createEditorModel("", "typescript");
const model2 = createEditorModel("", "typescript");
const editor1 = createEditorInstance($container1, model1);
const editor2 = createEditorInstance($container2, model2); // 第二个编辑器为只读

async function save() {
  const value1 = model1.getValue();
  await localforage.setItem('function-to-class', value1);
  console.log("\t[INFO]\t" + "Save Success");
}

async function fetch() {
  console.log("fetch");
  await localforage.getItem('function-to-class').then((value) => {
    model1.setValue(value as string || codeFunctionn2Class)
  });
  console.log("\t[INFO]\t" + "Fetch Success");
}

async function transform() {
  const value1 = model1.getValue();
  try {
    const [value, flag] = await processContent(value1);
    editor2.setValue(value);
    if (flag === "unrealized") {
      console.log("\t[WARN]\t" + "Format Unrealized");
    }
    if (flag === "success") {
      console.log("\t[INFO]\t" + "Format Success");
    }
  } catch (error: any) {
    editor2.setValue('');
    console.log("\t[Error]\t" + error.message);
  }
}

function render() {
  const app = `
  <div class="app-container screenshot">
      <div class="app-home">
        <div class="app-header">
          <span class="app-icon-button">
            <i class="icon red"></i>
            <i class="icon yellow"></i>
            <i class="icon green"></i>
          </span>
          <button class="app-button ml-1x" id="save">Save</button>
          <button class="app-button ml-1x" id="transform">Transform</button>
        </div>
        <div class="app-main">
          <div class="menu-container">
          </div>
          <div class="tool-container">
            <div id="editor-double"></div>
          </div>
        </div>
      </div>
    </div>
  `
  document.getElementById("app")!.innerHTML = app;  
}

async function onWindowLoad() {
  render();
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
