import React from 'react';
import { GameState } from '../data/types';
// import { getModeConfig, getThemeColors } from '../data/gameModes';

interface GameHomeProps {
  gameState: GameState;
  onPlayerSelect: (player: 'A' | 'B') => void;
  error?: string | null;
  onClearError?: () => void;
}

export const GameHome: React.FC<GameHomeProps> = ({
  gameState,
  onPlayerSelect,
  error,
  onClearError
}) => {
  if (!gameState.gameMode) {
    return null;
  }

  // const modeConfig = getModeConfig(gameState.gameMode);
  // const themeColors = getThemeColors(gameState.gameMode);

  const gradientStyle = {
    background: 'linear-gradient(135deg, #1a1859 0%, #241149 25%, #641159 50%, #b91b6f 75%, #2c2d32 100%)'
  };

  return (
    <div className="min-h-screen flex flex-col" style={gradientStyle}>
      {/* 错误提示 */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center">
            <span className="text-sm">{error}</span>
            {onClearError && (
              <button 
                onClick={onClearError}
                className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* 上半屏区域 */}
         <div 
           className={`flex-1 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
             gameState.currentPlayer === 'A' ? 'bg-white/20' : 'bg-white/5 opacity-50'
           } ${gameState.currentPlayer !== 'A' ? 'pointer-events-none' : ''}`}
           onClick={() => gameState.currentPlayer === 'A' && onPlayerSelect('A')}
         >
           <div className="text-center">
             <div className="mb-8 flex justify-center">
               <svg width="120" height="120" viewBox="0 0 120 120" className="stroke-white fill-none">
                 <circle cx="60" cy="60" r="50" strokeWidth="1" opacity="0.6"/>
                 <path d="M30 60 Q60 30 90 60 Q60 90 30 60" strokeWidth="1" opacity="0.8"/>
                 <circle cx="45" cy="50" r="3" fill="white" opacity="0.4"/>
                 <circle cx="75" cy="70" r="2" fill="white" opacity="0.6"/>
                 <line x1="40" y1="40" x2="80" y2="80" strokeWidth="0.5" opacity="0.3"/>
               </svg>
             </div>
             {gameState.currentPlayer === 'A' && (
               <p className="text-3xl font-extralight tracking-wider" style={{color: '#ffffff'}}>准备好坦诚相见了吗</p>
             )}
           </div>
         </div>

         {/* 分割线 */}
         <div className="h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent mx-16"></div>

         {/* 下半屏区域 */}
         <div 
           className={`flex-1 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 ${
             gameState.currentPlayer === 'B' ? 'bg-white/20' : 'bg-white/5 opacity-50'
           } ${gameState.currentPlayer !== 'B' ? 'pointer-events-none' : ''}`}
           onClick={() => gameState.currentPlayer === 'B' && onPlayerSelect('B')}
         >
           <div className="text-center">
             <div className="mb-8 flex justify-center">
               <svg width="120" height="120" viewBox="0 0 120 120" className="stroke-white fill-none">
                 <path d="M60 20 Q40 40 60 60 Q80 40 60 20" strokeWidth="1" opacity="0.7"/>
                 <path d="M60 60 Q35 80 60 100 Q85 80 60 60" strokeWidth="1" opacity="0.8"/>
                 <circle cx="60" cy="45" r="2" fill="white" opacity="0.5"/>
                 <circle cx="50" cy="75" r="1.5" fill="white" opacity="0.4"/>
                 <circle cx="70" cy="75" r="1.5" fill="white" opacity="0.4"/>
                 <line x1="30" y1="30" x2="90" y2="90" strokeWidth="0.5" opacity="0.2"/>
                 <line x1="90" y1="30" x2="30" y2="90" strokeWidth="0.5" opacity="0.2"/>
               </svg>
             </div>
             {gameState.currentPlayer === 'B' && (
               <p className="text-3xl font-extralight tracking-wider" style={{color: '#ffffff'}}>让秘密在此刻绽放</p>
             )}
           </div>
         </div>
    </div>
  );
};