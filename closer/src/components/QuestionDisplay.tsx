import React from 'react';
import { Question, ThemeColors } from '@/data/types';
// import { getModeConfig, getThemeColors } from '@/data/gameModes';

interface QuestionDisplayProps {
  question: Question;
  onFinish: () => void;
  currentPlayer: 'A' | 'B';
  gameMode: 'couple' | 'friendship';
  themeColors: ThemeColors;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onFinish,
  // currentPlayer,
  // gameMode,
  // themeColors
}) => {
  // const modeConfig = getModeConfig(gameMode);
  
  const gradientStyle = {
    background: 'linear-gradient(135deg, #1a1859 0%, #241149 25%, #641159 50%, #b91b6f 75%, #2c2d32 100%)'
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 cursor-pointer" 
      style={gradientStyle}
      onClick={onFinish}
    >
      <div className="w-full max-w-5xl text-center">
        <p className="text-5xl font-light leading-relaxed" style={{color: '#ffffff'}}>
          {question.content}
        </p>
      </div>
    </div>
  );
};