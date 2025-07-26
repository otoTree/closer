import React from 'react';
import { ThemeColors } from '../data/types';

interface LoadingSpinnerProps {
  themeColors: ThemeColors;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  themeColors, 
  message = '正在生成问题...' 
}) => {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.primary} 100%)`
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={gradientStyle}>
      <div className="text-center">
        {/* 旋转动画 */}
        <div className="relative mb-8">
          <div 
            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">🤔</div>
          </div>
        </div>
        
        {/* 加载文字 */}
        <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>
        <p className="text-white/80 text-lg">请稍等片刻...</p>
        
        {/* 动态点点点 */}
        <div className="mt-4 flex justify-center space-x-1">
          <div 
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};