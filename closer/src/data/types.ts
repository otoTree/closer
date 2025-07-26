// 游戏状态类型定义
export interface GameState {
  currentPlayer: 'A' | 'B';
  gameMode: 'couple' | 'friendship' | null; // null表示未选择模式
  questionHistory: string[];
  isFirstTime: boolean; // 是否首次进入
}

// 游戏模式配置
export interface GameModeConfig {
  mode: 'couple' | 'friendship';
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  icon?: string;
}

// 题目相关类型
export interface Question {
  id: string;
  category: 'couple' | 'friendship';
  content: string;
  timestamp: number; // 生成时间戳
}

export interface QuestionPrompt {
  category: 'couple' | 'friendship';
  context?: string; // 额外上下文信息
}

// 页面类型
export type Page = 'modeSelect' | 'home' | 'question' | 'loading';

// AI服务接口
export interface AIProvider {
  name: string;
  generateQuestion: (prompt: string) => Promise<string>;
  isAvailable: () => Promise<boolean>;
}

// 主题色彩
export interface ThemeColors {
  primary: string;
  secondary: string;
}