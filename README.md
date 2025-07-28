# Closer - 情侣朋友互动问答游戏

基于 Tauri + React + TypeScript 开发的互动问答游戏，支持AI智能生成题目，让情侣和朋友之间的交流更加深入有趣。

## 功能特性

- 🎮 **双人互动问答游戏** - 支持情侣模式和友情模式
- 🤖 **AI智能生成题目** - 基于DeepSeek Chat API动态生成个性化问题
- 🎨 **主题化UI设计** - 不同模式采用不同色彩主题
- 📱 **跨平台桌面应用** - 支持 Windows、macOS、Linux
- 💾 **状态持久化** - 自动保存游戏进度和历史记录
- 🔄 **轮流机制** - 智能管理玩家轮次

## 游戏玩法

1. **选择游戏模式**：
   - 🧡 **友情模式**：适合朋友间的轻松互动
   - 💕 **爱情模式**：专为情侣设计的深度交流

2. **轮流回答**：
   - 玩家A和玩家B轮流点击按钮
   - AI会根据当前模式生成相应的问题
   - 回答完成后切换到下一位玩家

3. **智能题目**：
   - 根据选择的模式生成不同类型的问题
   - 避免重复，保持新鲜感
   - 题目积极正面，促进良性交流

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

## 项目结构

```
src/
├── components/          # React 组件
│   ├── ui/             # shadcn/ui 基础组件
│   ├── GameHome.tsx    # 游戏主页面
│   ├── QuestionDisplay.tsx # 题目展示页面
│   ├── PlayerButton.tsx    # 玩家按钮组件
│   ├── ModeSelector.tsx    # 模式选择组件
│   └── LoadingSpinner.tsx  # 加载动画
├── hooks/              # 自定义 Hooks
│   ├── useGameState.ts # 游戏状态管理
│   ├── useQuestions.ts # 题目生成管理
│   └── use-mobile.ts   # 移动端检测
├── services/           # 服务层
│   └── aiService.ts    # AI API 服务
├── data/              # 数据和类型定义
│   ├── types.ts       # TypeScript 类型
│   ├── gameModes.ts   # 游戏模式配置
│   └── prompts.ts     # AI 提示词模板
├── lib/               # 工具函数
│   └── utils.ts       # 通用工具函数
└── App.tsx            # 主应用组件
```

## 技术栈

### 前端技术
- **框架**: React 18.3.1 + TypeScript 5.6.2
- **构建工具**: Vite 6.0.3
- **样式**: Tailwind CSS 4.1.11
- **UI组件**: shadcn/ui (基于 Radix UI)
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Zod 验证

### 桌面应用
- **框架**: Tauri 2.0
- **后端语言**: Rust
- **跨平台支持**: Windows, macOS, Linux, Android

### AI服务
- **API**: DeepSeek Chat API
- **模型**: deepseek-chat
- **功能**: 智能题目生成

## 开发指南

### 添加新的游戏模式

1. 在 `src/data/gameModes.ts` 中添加新模式配置：
```typescript
export const gameModes = {
  // 现有模式...
  newMode: {
    id: 'newMode',
    name: '新模式',
    description: '模式描述',
    colors: {
      primary: '#color1',
      secondary: '#color2'
    }
  }
};
```

2. 在 `src/data/prompts.ts` 中添加对应的提示词模板

3. 更新相关的 TypeScript 类型定义

### 自定义AI提示词

编辑 `src/data/prompts.ts` 文件来自定义不同模式下的AI提示词：

```typescript
export const prompts = {
  friendship: {
    system: "你是一个专业的友谊互动游戏主持人...",
    user: "请生成一个适合朋友间的真心话问题..."
  },
  couple: {
    system: "你是一个专业的情侣互动游戏主持人...",
    user: "请生成一个适合情侣间的真心话问题..."
  }
};
```

### 部署说明

#### 桌面应用打包
```bash
# 开发环境构建
npm run tauri dev

# 生产环境构建
npm run tauri build
```

#### Android 应用打包
参考 `docs/tauri-android-setup.md` 进行 Android 开发环境配置。

## 推荐开发环境

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [WebStorm](https://www.jetbrains.com/webstorm/) (可选)

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过 Issues 联系我们。
