import { useState, useEffect } from 'react';

import { GameHome } from './components/GameHome';
import { QuestionDisplay } from './components/QuestionDisplay';

import { useGameState } from './hooks/useGameState';
import { useQuestions } from './hooks/useQuestions';
import { getThemeColors } from './data/gameModes';
import { Page, Question } from './data/types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const {
    gameState,
    setGameMode,
    switchPlayer,
    addQuestionToHistory
  } = useGameState();
  
  const {
    generateQuestion
  } = useQuestions(gameState.gameMode || 'friendship');

  // 初始化游戏模式
  useEffect(() => {
    if (!gameState.gameMode) {
      setGameMode('friendship');
    }
  }, [gameState.gameMode, setGameMode]);

  // 根据游戏状态决定显示哪个页面
  useEffect(() => {
    if (currentQuestion) {
      setCurrentPage('question');
    } else {
      setCurrentPage('home');
    }
  }, [currentQuestion]);



  // 处理玩家选择（生成题目）
  const handlePlayerSelect = async (player: 'A' | 'B') => {
    if (gameState.currentPlayer !== player) {
      return;
    }

    try {
      setError(null);
      const question = await generateQuestion();
      setCurrentQuestion(question);
      addQuestionToHistory(question.content);
    } catch (error) {
      console.error('生成题目失败:', error);
      setError(error instanceof Error ? error.message : '生成题目失败，请检查网络连接和API配置');
      setCurrentPage('home');
    }
  };

  // 处理题目完成
  const handleQuestionFinish = () => {
    setCurrentQuestion(null);
    switchPlayer();
    setCurrentPage('home');
  };



  // 获取当前主题色彩
  const themeColors = gameState.gameMode ? getThemeColors(gameState.gameMode) : {
    primary: '#6b7280',
    secondary: '#e5e7eb'
  };

  // 渲染对应页面
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <GameHome
            gameState={gameState}
            onPlayerSelect={handlePlayerSelect}
            error={error}
            onClearError={() => setError(null)}
          />
        );
      

      
      case 'question':
        if (!currentQuestion || !gameState.gameMode) {
          return null;
        }
        return (
          <QuestionDisplay
            question={currentQuestion}
            onFinish={handleQuestionFinish}
            currentPlayer={gameState.currentPlayer}
            gameMode={gameState.gameMode}
            themeColors={themeColors}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
