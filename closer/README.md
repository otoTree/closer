# Closer - 情侣朋友互动问答游戏

基于 Tauri + React + TypeScript 开发的互动问答游戏，支持AI智能生成题目。

## 功能特性

- 🎮 双人互动问答游戏
- 🤖 AI智能生成个性化题目
- 🎨 深夜浪漫主题UI设计
- 📱 跨平台桌面应用

## 快速开始

### 环境要求

- Node.js 16+
- Rust 1.60+
- Tauri CLI

### 安装依赖

```bash
npm install
```

### AI API 配置

1. 复制环境变量模板文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 AI API token：
```env
VITE_AI_TOKEN=your_actual_token_here
```

### API 接口说明

本应用使用 DeepSeek Chat API 生成智能题目：

- **接口地址**: `https://aiproxy.bja.sealos.run/v1/chat/completions`
- **模型**: `deepseek-chat`
- **认证方式**: Bearer Token

示例请求：
```bash
curl --request POST \
  --url https://aiproxy.bja.sealos.run/v1/chat/completions \
  --header "Authorization: Bearer $token" \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "user",
        "content": "生成一个情侣互动问题"
      }
    ],
    "stream": false,
    "max_tokens": 512,
    "temperature": 0.7
  }'
```

### 开发模式

```bash
npm run tauri dev
```

### 构建应用

```bash
npm run tauri build
```

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS
- **桌面框架**: Tauri
- **AI服务**: DeepSeek Chat API
- **构建工具**: Vite

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
