import { GameModeConfig } from './types';

// 游戏模式配置
export const gameModeConfigs: Record<'couple' | 'friendship', GameModeConfig> = {
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

// 获取模式配置
export const getModeConfig = (mode: 'couple' | 'friendship'): GameModeConfig => {
  return gameModeConfigs[mode];
};

// 获取主题色彩
export const getThemeColors = (mode: 'couple' | 'friendship') => {
  const config = getModeConfig(mode);
  return {
    primary: config.primaryColor,
    secondary: config.secondaryColor
  };
};