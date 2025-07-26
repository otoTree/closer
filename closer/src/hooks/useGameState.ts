import { useState, useEffect } from 'react';
import { GameState } from '../data/types';

const STORAGE_KEY = 'truth-dare-game-state';

// 默认游戏状态
const defaultGameState: GameState = {
  currentPlayer: 'A',
  gameMode: null,
  questionHistory: [],
  isFirstTime: true
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // 从localStorage加载状态
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setGameState(parsedState);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }, []);

  // 保存状态到localStorage
  const saveGameState = (newState: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setGameState(newState);
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  };

  // 设置游戏模式
  const setGameMode = (mode: 'couple' | 'friendship') => {
    const newState: GameState = {
      ...gameState,
      gameMode: mode,
      isFirstTime: false,
      currentPlayer: 'A', // 重置为玩家A开始
      questionHistory: [] // 清空历史记录
    };
    saveGameState(newState);
  };

  // 切换玩家
  const switchPlayer = () => {
    const newState: GameState = {
      ...gameState,
      currentPlayer: gameState.currentPlayer === 'A' ? 'B' : 'A'
    };
    saveGameState(newState);
  };

  // 添加题目到历史记录
  const addQuestionToHistory = (question: string) => {
    const newHistory = [question, ...gameState.questionHistory].slice(0, 20); // 保持最近20题
    const newState: GameState = {
      ...gameState,
      questionHistory: newHistory
    };
    saveGameState(newState);
  };

  // 重置游戏
  const resetGame = () => {
    const newState: GameState = {
      ...defaultGameState,
      gameMode: gameState.gameMode // 保持当前模式
    };
    saveGameState(newState);
  };

  // 完全重置（包括模式）
  const fullReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(defaultGameState);
  };

  return {
    gameState,
    setGameMode,
    switchPlayer,
    addQuestionToHistory,
    resetGame,
    fullReset
  };
};