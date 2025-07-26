# 情侣友谊真心话游戏 - 开发需求文档

## 项目概述

基于现有的 Tauri + React + TypeScript 技术栈，开发一个情侣、友谊真心话提问的互动游戏应用。

## 技术栈分析

### 前端技术栈
- **框架**: React 18.3.1 + TypeScript 5.6.2
- **构建工具**: Vite 6.0.3
- **样式**: Tailwind CSS 4.1.11
- **UI组件库**: shadcn/ui (基于 Radix UI)
- **状态管理**: React Hooks (useState, useEffect等)
- **表单处理**: React Hook Form + Zod 验证

### 后端技术栈
- **桌面应用框架**: Tauri 2.0
- **后端语言**: Rust
- **跨平台支持**: Windows, macOS, Linux, Android

### 开发工具
- **包管理器**: pnpm
- **代码规范**: TypeScript 严格模式
- **开发服务器**: Vite Dev Server (端口: 1420)

## 功能需求

### 1. 主页面 (GameHome)

#### 1.1 页面布局
- **顶部区域**: 游戏模式选择（友情/爱情）
- **中间区域**: 游戏标题和当前模式显示
- **下半部分**: 垂直布局的玩家按钮区域
  - 上半部分：玩家A按钮区域
  - 下半部分：玩家B按钮区域

#### 1.2 游戏模式选择
- **模式切换**: 顶部提供友情/爱情模式切换按钮或标签页
- **视觉区分**: 不同模式使用不同的色彩主题
  - 友情模式：温暖的橙色/黄色系
  - 爱情模式：浪漫的粉色/红色系
- **模式状态**: 选择模式后影响后续AI生成的题目类型

#### 1.3 按钮状态管理
- **初始状态**: 选择模式后，两个按钮都可点击
- **轮次状态**: 只有当前轮次的玩家按钮可点击
- **按钮样式**: 
  - 可点击状态：高亮、有悬停效果，颜色跟随当前模式
  - 不可点击状态：灰色、禁用状态

#### 1.4 交互逻辑
- 首次进入需要选择游戏模式（友情/爱情）
- 选择模式后显示玩家按钮
- 点击任一按钮后，跳转到题目展示页面
- 记录当前是哪个玩家的回合和当前游戏模式
- 下次返回时，另一个玩家的按钮变为可点击状态
- 可以随时切换游戏模式，但会重置游戏状态

### 2. 题目展示页面 (QuestionDisplay)

#### 2.1 页面布局
- 居中显示题目内容
- 题目文字大小适中，易于阅读
- 底部或角落放置"结束问题"按钮

#### 2.2 题目内容
- 从预设题库中随机选择
- 题目分类：情侣类、友谊类
- 支持后续扩展题库

#### 2.3 交互逻辑
- 显示当前题目
- 点击"结束问题"按钮返回主页面
- 返回时切换到另一个玩家的回合

### 3. 游戏状态管理

#### 3.1 状态定义
```typescript
interface GameState {
  currentPlayer: 'A' | 'B';
  gameMode: 'couple' | 'friendship' | null; // null表示未选择模式
  questionHistory: string[];
  isFirstTime: boolean; // 是否首次进入
}

interface GameModeConfig {
  mode: 'couple' | 'friendship';
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  icon?: string;
}
```

#### 3.2 状态持久化
- 使用 localStorage 保存游戏状态
- 应用重启后恢复上次的游戏状态

## 技术实现方案

### 1. 项目结构

```
src/
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── GameHome.tsx        # 主页面组件
│   ├── QuestionDisplay.tsx # 题目展示组件
│   ├── PlayerButton.tsx    # 玩家按钮组件
│   └── LoadingSpinner.tsx  # 加载动画组件
├── hooks/
│   ├── useGameState.ts     # 游戏状态管理
│   ├── useQuestions.ts     # AI题目生成管理
│   └── useAI.ts           # AI服务集成
├── services/
│   ├── aiService.ts        # AI服务接口
│   ├── promptBuilder.ts    # AI提示词构建
│   └── questionCache.ts    # 题目缓存管理
├── data/
│   ├── prompts.ts          # AI提示词模板
│   └── types.ts           # 类型定义
├── lib/
│   └── utils.ts           # 工具函数
└── App.tsx                # 主应用组件
```

### 2. AI服务集成方案

#### 2.1 AI服务选择
- **推荐方案**: 使用 Tauri 的 HTTP 客户端调用云端AI API
- **备选方案**: 集成本地AI模型（如 Ollama）
- **API选项**: OpenAI GPT、Claude、或国产AI服务

#### 2.2 AI服务架构
```typescript
// AI服务接口定义
interface AIProvider {
  name: string;
  generateQuestion: (prompt: string) => Promise<string>;
  isAvailable: () => Promise<boolean>;
}

// 支持多种AI服务
const aiProviders: AIProvider[] = [
  new OpenAIProvider(),
  new ClaudeProvider(),
  new LocalAIProvider(), // 本地AI模型
];
```

#### 2.3 提示词工程
```typescript
const buildPrompt = (params: QuestionPrompt): string => {
  const basePrompt = `请生成一个${params.category === 'couple' ? '情侣' : '友谊'}类的真心话问题。`;
  const difficultyGuide = {
    easy: '问题应该轻松有趣，适合刚认识的人',
    medium: '问题可以稍微深入，适合熟悉的朋友',
    hard: '问题可以比较深刻，适合亲密关系'
  };
  
  return `${basePrompt}
难度：${params.difficulty} - ${difficultyGuide[params.difficulty]}
要求：
1. 问题积极正面，促进交流
2. 避免过于私密或敏感话题
3. 表达清晰，易于理解
4. 直接返回问题内容，不要额外说明
${params.context ? `\n额外要求：${params.context}` : ''}`;
};
```

### 3. 路由管理

使用 React 状态管理实现页面切换和模式管理：

```typescript
type Page = 'modeSelect' | 'home' | 'question' | 'loading';

const [currentPage, setCurrentPage] = useState<Page>('modeSelect');
const [gameMode, setGameMode] = useState<'couple' | 'friendship' | null>(null);

// 游戏模式配置
const gameModeConfigs: Record<'couple' | 'friendship', GameModeConfig> = {
  couple: {
    mode: 'couple',
    title: '爱情模式',
    description: '探索彼此的内心世界',
    primaryColor: '#ff6b9d',
    secondaryColor: '#ffc3d8',
    icon: '💕'
  },
  friendship: {
    mode: 'friendship', 
    title: '友情模式',
    description: '加深友谊的美好时光',
    primaryColor: '#4ecdc4',
    secondaryColor: '#a8e6cf',
    icon: '🤝'
  }
};
```

### 4. 组件设计

#### 4.1 ModeSelector 组件
```typescript
interface ModeSelectorProps {
  onModeSelect: (mode: 'couple' | 'friendship') => void;
  selectedMode?: 'couple' | 'friendship' | null;
}
```

#### 4.2 PlayerButton 组件
```typescript
interface PlayerButtonProps {
  player: 'A' | 'B';
  isActive: boolean;
  onSelect: () => void;
  label: string;
  gameMode: 'couple' | 'friendship';
  themeColors: {
    primary: string;
    secondary: string;
  };
}
```

#### 4.3 QuestionDisplay 组件
```typescript
interface QuestionDisplayProps {
  question: string;
  onFinish: () => void;
  currentPlayer: 'A' | 'B';
  gameMode: 'couple' | 'friendship';
  themeColors: {
    primary: string;
    secondary: string;
  };
}
```

### 5. 样式设计

#### 5.1 设计原则
- 简洁现代的UI设计
- 根据游戏模式动态切换色彩主题
- 响应式设计，适配不同屏幕尺寸
- 流畅的动画过渡效果
- 模式切换时的平滑过渡动画

#### 5.2 色彩方案
- **爱情模式**：
  - 主色调：浪漫的粉色/红色系 (#ff6b9d)
  - 辅助色：柔和的粉色 (#ffc3d8)
  - 渐变效果：粉色到红色的渐变
- **友情模式**：
  - 主色调：温暖的青色/绿色系 (#4ecdc4)
  - 辅助色：清新的绿色 (#a8e6cf)
  - 渐变效果：青色到绿色的渐变
- **通用色彩**：
  - 中性色：灰色系用于禁用状态
  - 背景色：根据模式调整的浅色背景

#### 4.3 组件样式
- 使用 shadcn/ui 的 Button 组件作为基础
- 自定义样式适配游戏主题
- 添加悬停和点击动画效果

### 6. AI题目生成设计

#### 5.1 数据结构
```typescript
interface Question {
  id: string;
  category: 'couple' | 'friendship';
  content: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timestamp: number; // 生成时间戳
}

interface QuestionPrompt {
  category: 'couple' | 'friendship';
  difficulty: 'easy' | 'medium' | 'hard';
  context?: string; // 额外上下文信息
}
```

#### 5.2 AI生成策略
- **情侣类题目**：关于感情、未来规划、喜好、回忆等主题
- **友谊类题目**：关于友谊、共同经历、价值观、兴趣爱好等
- **生成原则**：
  - 题目内容积极正面，促进交流
  - 避免过于私密或敏感的话题
  - 题目表达清晰，易于理解
  - 适合不同年龄段和关系阶段

#### 5.3 题目缓存机制
- 使用数组存储最近生成的题目（如最近20题）
- 避免短时间内重复相同题目
- 应用关闭时清空缓存，下次启动重新生成

### 7. 状态管理

#### 6.1 useGameState Hook
```typescript
const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>();
  
  const switchPlayer = () => {
    // 切换玩家逻辑
  };
  
  const resetGame = () => {
    // 重置游戏逻辑
  };
  
  return { gameState, switchPlayer, resetGame };
};
```

#### 6.2 useQuestions Hook
```typescript
const useQuestions = (category: 'couple' | 'friendship') => {
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateQuestion = async (difficulty: string = 'medium') => {
    setIsGenerating(true);
    try {
      // 调用AI生成题目
      const newQuestion = await generateQuestionWithAI({
        category,
        difficulty,
        excludeHistory: questionHistory.map(q => q.content)
      });
      
      // 添加到历史记录，保持最近20题
      setQuestionHistory(prev => {
        const updated = [newQuestion, ...prev];
        return updated.slice(0, 20);
      });
      
      return newQuestion;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { generateQuestion, isGenerating, questionHistory };
};
```

#### 6.3 AI生成服务
```typescript
interface AIQuestionService {
  generateQuestion: (prompt: QuestionPrompt) => Promise<Question>;
}

const generateQuestionWithAI = async (params: {
  category: 'couple' | 'friendship';
  difficulty: string;
  excludeHistory?: string[];
}): Promise<Question> => {
  // 构建AI提示词
  const prompt = buildPrompt(params);
  
  // 调用AI API生成题目
  const response = await callAIAPI(prompt);
  
  return {
    id: generateId(),
    category: params.category,
    content: response.content,
    difficulty: params.difficulty as any,
    timestamp: Date.now()
  };
};
```

## 开发计划

### 第一阶段：基础功能开发
1. 创建游戏模式选择界面
2. 创建基础组件结构
3. 实现页面切换逻辑（模式选择→主页→题目页）
4. 开发玩家按钮交互
5. 实现基础的状态管理
6. 实现主题色彩动态切换

### 第二阶段：AI生成和游戏逻辑
1. 设计并实现AI题目生成接口
2. 开发题目生成和缓存逻辑
3. 实现游戏状态持久化
4. 添加题目历史记录功能
5. 集成AI服务（可选择本地AI或云端API）
6. 实现AI服务的错误处理和重试机制
7. 添加加载状态和用户反馈

### 第三阶段：UI优化和体验提升
1. 优化界面设计和动画效果
2. 添加音效和视觉反馈
3. 实现响应式设计
4. 性能优化和测试

### 第四阶段：功能扩展
1. 添加游戏模式选择
2. 实现AI生成参数自定义（难度、主题等）
3. 添加统计和历史记录
4. 支持多语言
5. 优化AI生成速度和质量

## 技术要求

### 1. 代码规范
- 使用 TypeScript 严格模式
- 遵循 React Hooks 最佳实践
- 组件采用函数式组件 + Hooks
- 使用 ESLint 和 Prettier 保证代码质量

### 2. 性能要求
- 页面切换流畅，无明显延迟
- AI生成题目响应时间控制在5秒内
- 内存使用合理，避免内存泄漏
- 支持 Tauri 的原生性能优化
- 实现题目缓存减少重复请求

### 3. 兼容性要求
- 支持主流桌面操作系统
- 预留移动端适配的可能性
- 支持不同屏幕分辨率
- 支持离线模式（使用本地AI或预设题目）

### 4. AI集成要求
- 支持多种AI服务提供商
- 实现AI服务的故障转移机制
- API密钥安全存储（使用Tauri的安全存储）
- 请求频率限制和错误重试机制

## 验收标准

### 1. 功能验收
- [ ] 游戏模式选择界面正确显示
- [ ] 友情/爱情模式切换功能正常
- [ ] 主页面两个按钮正确显示和交互
- [ ] 按钮状态正确切换（轮流可点击）
- [ ] AI题目生成功能正常工作
- [ ] 不同模式生成对应类型的题目
- [ ] 题目页面正确显示生成的题目
- [ ] "结束问题"功能正常工作
- [ ] 游戏状态在页面刷新后保持
- [ ] AI生成失败时有合适的错误处理
- [ ] 题目生成过程中显示加载状态
- [ ] 模式切换时主题色彩正确更新

### 2. 界面验收
- [ ] 模式选择界面美观直观
- [ ] 不同模式的主题色彩区分明显
- [ ] 界面美观，符合对应模式的主题风格
- [ ] 响应式设计，适配不同屏幕
- [ ] 动画效果流畅自然
- [ ] 模式切换动画平滑过渡
- [ ] 按钮状态视觉反馈清晰

### 3. 代码质量验收
- [ ] TypeScript 类型定义完整
- [ ] 组件结构清晰，职责分明
- [ ] 代码注释充分，易于维护
- [ ] 无明显性能问题

## 后续扩展计划

1. **社交功能**：支持在线多人游戏
2. **个性化**：用户自定义AI生成偏好和主题
3. **统计分析**：游戏数据统计和分析
4. **移动端**：开发移动端版本
5. **AI优化**：
   - 基于用户反馈优化题目质量
   - 支持多种AI模型选择
   - 个性化题目生成（基于历史偏好）
   - 本地AI模型集成（离线使用）

---

**文档版本**: v1.0  
**创建日期**: 2024年12月  
**最后更新**: 2024年12月