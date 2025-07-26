import { useState } from 'react';
import { Question } from '../data/types';
import { generateQuestionWithAI } from '../services/aiService';

export const useQuestions = (category: 'couple' | 'friendship') => {
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // 生成新题目
  const generateQuestion = async (): Promise<Question> => {
    setIsGenerating(true);
    
    try {
      // 获取历史题目内容，用于避免重复
      const excludeHistory = questionHistory.map(q => q.content);
      
      // 调用AI生成题目
      const newQuestion = await generateQuestionWithAI({
        category,
        excludeHistory
      });
      
      // 添加到历史记录，保持最近20题
      setQuestionHistory(prev => {
        const updated = [newQuestion, ...prev];
        return updated.slice(0, 20);
      });
      
      // 设置为当前题目
      setCurrentQuestion(newQuestion);
      
      return newQuestion;
    } catch (error) {
      console.error('生成题目失败:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // 清空历史记录
  const clearHistory = () => {
    setQuestionHistory([]);
    setCurrentQuestion(null);
  };

  // 获取历史题目
  const getQuestionHistory = () => {
    return questionHistory;
  };

  // 检查题目是否重复
  const isDuplicateQuestion = (content: string): boolean => {
    return questionHistory.some(q => q.content === content);
  };

  return {
    currentQuestion,
    questionHistory,
    isGenerating,
    generateQuestion,
    clearHistory,
    getQuestionHistory,
    isDuplicateQuestion
  };
};