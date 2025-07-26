import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { gameModeConfigs } from '../data/gameModes';

interface ModeSelectorProps {
  onModeSelect: (mode: 'couple' | 'friendship') => void;
  selectedMode?: 'couple' | 'friendship' | null;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect, selectedMode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">真心话游戏</h1>
        <p className="text-lg text-gray-600">选择游戏模式，开始你们的互动之旅</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {Object.values(gameModeConfigs).map((config) => (
          <Card 
            key={config.mode}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedMode === config.mode 
                ? 'ring-2 ring-offset-2 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            style={{
              borderColor: selectedMode === config.mode ? config.primaryColor : undefined
            }}
            onClick={() => onModeSelect(config.mode)}
          >
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{config.icon}</div>
              <CardTitle 
                className="text-2xl font-bold"
                style={{ color: config.primaryColor }}
              >
                {config.title}
              </CardTitle>
              <CardDescription className="text-base">
                {config.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                className="w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: config.primaryColor,
                  borderColor: config.primaryColor
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onModeSelect(config.mode);
                }}
              >
                选择 {config.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>💡 提示：不同模式会生成不同类型的问题</p>
      </div>
    </div>
  );
};