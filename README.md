# code-tools

一个基于 AI + 提示词的代码转换工具

[![code-tools](https://www.gausszhou.top/static/data/github/code-tools/1.webp)](https://gausszhou.github.io/code-tools/)


## Dependencies

注意：当前版本暂时不支持配置接口地址，请在本地安装 `Ollama` 并部署 `qwen2.5-coder:7b`  
注意：如遇到跨域问题，请配置环境变量 `OLLAMA_ORIGINS` 为 `*`

## Features

- [ ] 支持配置模型
- [x] 支持调用 Ollama
- [ ] 支持调用 Deepseek
- [x] 预置提示词，Function 转换为 Class
- [x] 预置提示词，Vue Options 转 Vue Composition
- [x] 预置提示词，React Class Component 转 React Function Component
