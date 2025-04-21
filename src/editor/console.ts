import dayjs from "dayjs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { addContainer, createEditorContainer, createEditorInstance, createEditorModel } from ".";

class EditorConsole {
  editor: monaco.editor.IStandaloneCodeEditor;
  container: HTMLElement;
  isShow: boolean = true;
  constructor() {
    const code = ``;
    const language = "text/plain";
    const model = createEditorModel(code, language);
    this.container = createEditorContainer();
    this.editor = createEditorInstance(this.container, model);
    this.editor.updateOptions({
      readOnly: true,
      scrollBeyondLastColumn: 1,
      renderLineHighlight:'none',
      minimap: {
        enabled: false, // 是否启用预览图
      },
      scrollbar: {
        verticalScrollbarSize: 0
      }
    });
    this.initEvent()
  }
  initEvent(){
    window.addEventListener('keydown',(e)=>{
      if(e.key === '`' && e.ctrlKey){
        this.toggle()
      }
    })
  }
  addConsole(message: string) {
    const originMessage = this.editor.getValue();
    const now = dayjs().format("hh:mm:ss");
    this.editor.setValue(now + message + "\n" + originMessage);
    this.editor.revealPositionInCenter({ lineNumber: 1, column: 0 });
  }
  toggle() {
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.show();
    } else {
      this.hidden();
    }
  }
  show() {
    this.container.parentElement!.style.display = "revert";
  }
  hidden() {
    this.container.parentElement!.style.display = "none";
  }
  mount(dom: HTMLElement) {
    addContainer(dom, this.container);
  }
}

const editorConsole = new EditorConsole();
export default editorConsole;
