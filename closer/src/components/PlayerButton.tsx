import React from 'react';
import { Button } from './ui/button';
import { ThemeColors } from '../data/types';

interface PlayerButtonProps {
  player: 'A' | 'B';
  isActive: boolean;
  onSelect: () => void;
  label: string;
  gameMode: 'couple' | 'friendship';
  themeColors: ThemeColors;
  disabled?: boolean;
}

export const PlayerButton: React.FC<PlayerButtonProps> = ({
  player,
  isActive,
  onSelect,
  label,
  // gameMode,
  themeColors,
  disabled = false
}) => {
  const buttonStyle = {
    backgroundColor: isActive && !disabled ? themeColors.primary : '#e5e7eb',
    borderColor: isActive && !disabled ? themeColors.primary : '#d1d5db',
    color: isActive && !disabled ? 'white' : '#6b7280',
    opacity: disabled ? 0.5 : 1
  };

  const hoverStyle = {
    backgroundColor: !disabled ? themeColors.secondary : undefined
  };

  return (
    <div className="flex-1 p-4">
      <Button
        className={`w-full h-32 text-xl font-bold rounded-2xl transition-all duration-300 transform ${
          isActive && !disabled 
            ? 'scale-105 shadow-lg' 
            : disabled 
            ? 'cursor-not-allowed' 
            : 'hover:scale-102 hover:shadow-md'
        }`}
        style={buttonStyle}
        onClick={onSelect}
        disabled={disabled}
        onMouseEnter={(e) => {
          if (!disabled && isActive) {
            e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor || themeColors.secondary;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && isActive) {
            e.currentTarget.style.backgroundColor = themeColors.primary;
          }
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-3xl">
            {player === 'A' ? '👤' : '👥'}
          </div>
          <div>{label}</div>
          {isActive && !disabled && (
            <div className="text-sm opacity-90">
              点击开始
            </div>
          )}
        </div>
      </Button>
    </div>
  );
};