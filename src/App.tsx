import React, { useState, useEffect, useRef } from "react";

import {
  addContainer,
  addEditorIntoManageList,
  createEditorContainer,
  createEditorInstance,
  createEditorModel,
} from "./editor/index";
import { ITool, tools } from "./config";
import { OllamaService } from "./api/ollama";

const CodeToolsApp: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<string>(
    localStorage.getItem('code-tools-tool') || tools[0].value
  );
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    tools.find(tool => tool.value === currentTool)?.prompt || ""
  );
  const [currentModel, setCurrentModel] = useState<string>(
    localStorage.getItem('code-tools-model') || "qwen2.5-coder:7b"
  );

  const model1 = useRef(createEditorModel("", "typescript"));
  const model2 = useRef(createEditorModel("", "typescript"));
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    renderPresetTools();
    renderEditor();
  }, []);

  const renderPresetTools = () => {
    return tools.map((tool) => (
      <div
        key={tool.value}
        className={`menu-item g-menu-item ${currentTool === tool.value ? 'is-active' : ''}`}
        onClick={() => onToolChange(tool)}
      >
        {tool.label}
      </div>
    ));
  };

  const renderEditor = () => {
    if (!editorContainerRef.current) return;

    const $container2 = createEditorContainer();
    const $container1 = createEditorContainer();
    const editor1 = createEditorInstance($container1, model1.current);
    const editor2 = createEditorInstance($container2, model2.current);
    addEditorIntoManageList(editor1);
    addEditorIntoManageList(editor2);

    editorContainerRef.current.innerHTML = '';
    addContainer(editorContainerRef.current, $container1);
    addContainer(editorContainerRef.current, $container2);
  };

  const onToolChange = (tool: ITool) => {
    console.log("\t[INFO]\t" + `Current Tool: ${tool.value}`);
    setCurrentTool(tool.value);
    setCurrentPrompt(tool.prompt || "");
    localStorage.setItem('code-tools-tool', tool.value);
    localStorage.setItem('code-tools-prompt', tool.prompt || "");
    model1.current.setValue(tool.example || "");
    model2.current.setValue("");
  };

  const handleExecute = async () => {
    const code = model1.current.getValue().trim();
    if (!code) {
      alert("请先输入代码");
      return;
    }
    const prompt = currentPrompt.replace("{code}", code);
    console.log("\t[INFO]\t" + `Prompt: \r\n${prompt}`);

    try {
      const ollamaService = new OllamaService();
      console.log("\t[INFO]\t" + `Current Model: ${currentModel}`);
      model2.current.setValue("正在执行，请稍候...");

      let answer = '';
      await ollamaService.getAnswer(currentModel, prompt, (text: string) => {
        answer += text;
        model2.current.setValue(
          answer.replace('```javascript', '')
            .replace('```typescript', '')
            .replace('```', '')
            .trim()
        );
      });
      console.log("\t[INFO]\t" + `Execution completed.`);
    } catch (error) {
      console.error("Error:", error);
      alert("执行失败，请检查控制台日志");
    }
  };

  return (
    <div className="app-container screenshot">
      <div className="app-home">
        <div className="app-header">
          <span className="app-icon-button">
            <i className="icon red"></i>
            <i className="icon yellow"></i>
            <i className="icon green"></i>
          </span>
          <div className="app-button-group">
            <button className="app-button" onClick={handleExecute}>
              Execute
            </button>
          </div>
        </div>
        <div className="app-main">
          <div className="menu-container">
            <div className="g-menu second-level" id="menu-container">
              {renderPresetTools()}
            </div>
          </div>
          <div className="tool-container">
            <div id="editor-container" ref={editorContainerRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeToolsApp;