import { EditorState  } from "@codemirror/state";
import { EditorView, lineNumbers, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
// import { oneDark } from '@codemirror/theme-one-dark';


export function createEditorModel(doc: string) {
  let startState = EditorState.create({
    doc: doc,
    extensions: [
      // oneDark,
      lineNumbers(),
      keymap.of(defaultKeymap),
      javascript(),
      syntaxHighlighting(defaultHighlightStyle),
    ],
    
  });
  return startState;
}

export function createEditorInstance(
  $container: HTMLElement,
  state: EditorState
) {
  let editor = new EditorView({
    state: state,
    extensions: [],
    parent: $container,
  });
  return editor;
}

// 初始化变量
let editorList: EditorView[] = [];
export function addEditorIntoManageList(editor: EditorView) {
  editorList.push(editor);
}

export function disposeEditorList() {
  editorList.forEach((editor) => {
    editor.destroy();
  });
  editorList = [];
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
