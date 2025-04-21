import "./styles/index.css";
import "./styles/app.css";
import "./styles/gauss-ui/g-desc.css";
import "./styles/gauss-ui/g-menu.css";
import "./styles/gauss-ui/g-divider.css";
import {
  addContainer,
  addEditorIntoManageList,
  createEditorContainer,
  createEditorInstance,
  createEditorModel,
} from "./editor/index";
import { ITool, tools } from "./config";
import { OllamaService } from "./api/ollama";

let currentTool = localStorage.getItem('code-tools-tool') || tools[0].value;
let currentPrompt = tools.find(tool => tool.value === currentTool)?.prompt || "";
let currentModel = localStorage.getItem('code-tools-model') || "qwen2.5-coder:7b";
const model1 = createEditorModel("", "typescript");
const model2 = createEditorModel("", "typescript");

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
          <div class="app-button-group">
            <button class="app-button" id="app-button-excute">Excute</button>
          </div>
        </div>
        <div class="app-main">
          <div class="menu-container">
          <div class="g-menu second-level" id="menu-container">
          </div>
          </div>
          <div class="tool-container">
            <div id="editor-container"></div>
          </div>
        </div>
      </div>
    </div>
  `
  document.getElementById("app")!.innerHTML = app;
}

function renderPresetTools() {
  const $menu = document.getElementById("menu-container");
  tools.forEach((tool) => {
    const $tool = document.createElement("div");
    $tool.className = "menu-item";
    $tool.classList.add("g-menu-item");
    $tool.innerHTML = `${tool.label}`;
    $menu?.appendChild($tool);
    $tool.addEventListener("click", () => {
      document.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.remove("is-active");
      })
      $tool.classList.add("is-active");
      onToolChange(tool);
    });
  })
}

function renderEditor() {
  const $container2 = createEditorContainer();
  const $container1 = createEditorContainer();
  const editor1 = createEditorInstance($container1, model1);
  const editor2 = createEditorInstance($container2, model2); // 第二个编辑器为只读
  addEditorIntoManageList(editor1);
  addEditorIntoManageList(editor2);
  const $container = document.getElementById("editor-container") as HTMLElement
  addContainer($container, $container1);
  addContainer($container, $container2);
}

function onToolChange(tool: ITool) {
  console.log("\t[INFO]\t" + `Current Tool: ${tool.value}`);
  currentTool = tool.value;
  currentPrompt = tool.prompt;
  localStorage.setItem('code-tools-tool', tool.value);
  localStorage.setItem('code-tools-prompt', tool.prompt || "");
  model1.setValue(tool.example || "");
  model2.setValue("");
}

function bindExcuteButton() {
  document.querySelector("#app-button-excute")?.addEventListener("click", async () => {
    const code = model1.getValue().trim();
    if (!code) {
      alert("请先输入代码");
      return;
    }
    const prompt = currentPrompt.replace("{code}", code);
    console.log("\t[INFO]\t" + `Prompt: \r\n${prompt}`);
    try {
      const ollamaService = new OllamaService();
      
      console.log("\t[INFO]\t" + `Current Model: ${currentModel}`);
      model2.setValue("正在执行，请稍候...");
      let answer = ''
      await ollamaService.getAnswer(currentModel, prompt, (text: string) => {
        answer += text;
        model2.setValue(answer.replace('```javascript','').replace('```typescript', '').replace('```', '').trim());
      });
      console.log("\t[INFO]\t" + `Execution completed.`);
    } catch (error) {
      console.error("Error:", error);
      alert("执行失败，请检查控制台日志");
    }
  })
}

async function onWindowLoad() {
  render();
  renderPresetTools();
  renderEditor();
  bindExcuteButton();
}

window.addEventListener("load", () => onWindowLoad());
