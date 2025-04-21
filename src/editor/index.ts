import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";

export function createEditorModel(value: string, language: string) {
  const model = monaco.editor.createModel(value, language);
  return model;
}

export function setModelLanguage(model: monaco.editor.ITextModel, language: string) {
  monaco.editor.setModelLanguage(model, language);
}

export function createEditorInstance(
  $container: HTMLElement,
  model: monaco.editor.ITextModel,
  option?: monaco.editor.IStandaloneEditorConstructionOptions
) {
  const editor = monaco.editor.create($container, {
    theme: "vs-dark",
    automaticLayout: true, // 自动布局
    folding: true,
    wordWrap: "on", // 自动换行
    model: model,
    ...option,
  });
  return editor;
}

export function createEditorDiff($container: HTMLElement) {
  const editor = monaco.editor.createDiffEditor($container, {
    foldingStrategy: "indentation",
    autoClosingOvertype: "always",
    autoIndent: "full",
    // 
    theme: "vs-dark",
    automaticLayout: true, // 自动布局
    diffAlgorithm: "advanced",
    originalEditable: true, // for left pane
    readOnly: false, // for right pane
  });
  return editor;
}

// 初始化变量
let editorList: any[] = [];
export function addEditorIntoManageList(editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor) {
  editorList.push(editor);
}

export function disposeEditorList() {
  editorList.forEach((editor) => {
    editor.dispose();
  });
  editorList = [];
}

export function addCommandSave(
  editor: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor,
  callback: Function
) {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
    callback && callback();
  });
}

// container
let fileCounter = 0;
export function createEditorContainer() {
  const $container = document.createElement("div");
  $container.id = "container-" + fileCounter.toString(10);
  $container.className = "container";
  fileCounter += 1; // id++
  return $container;
}

export function addContainer($parent: HTMLElement, $children: HTMLElement) {
  if ($parent) {
    $parent.appendChild($children);
  } else {
    console.log($parent, "is not a HTMLElement");
  }
}

export default {};
