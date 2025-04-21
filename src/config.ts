import promptF2C from "./data/function-to-class-prompt.md?raw";
import exampleF2C from "./data/function-to-class-example.js?raw";
import promptO2C from "./data/options-to-composition-prompt.md?raw";
import exampleO2C from "./data/options-to-composition-example.js?raw";
import promptR2C from "./data/react-class-to-function-prompt.md?raw";
import exampleR2C from "./data/react-class-to-function-example.jsx?raw";

export interface ITool {
    label: string;
    icon: string;
    value: string;
    description: string;
    prompt: string;
    example: string;
}

export const tools: ITool[] = [
    {
        label: "Function 2 Class",
        icon: "",
        value: "function-to-class",
        description: "ES5 Function 转换为 ES6 Class",
        prompt: promptF2C,
        example: exampleF2C,
    },
    {
        label: "Options 2 Setup",
        icon: "",
        value: "options-to-composition",
        description: "Options 组件转换为 Composition API 组件",
        prompt: promptO2C,
        example: exampleO2C,
    },
    {
        label: "React Class 2 FC",
        icon: "",
        value: "react-class-to-function",
        description: "Options 组件转换为 Composition API 组件",
        prompt: promptR2C,
        example: exampleR2C,
    },
];
