import { Question, QuestionPrompt } from '../data/types';
import { buildPrompt } from '../data/prompts';

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};



// 使用真实AI API的函数（使用deepseek-chat模型）
const callRealAI = async (prompt: string): Promise<string> => {
  // 从环境变量获取API密钥
  const API_TOKEN = import.meta.env.VITE_AI_TOKEN || '';
  //console.log(API_TOKEN)
  
  if (!API_TOKEN) {
    throw new Error('AI API token未配置');
  }
  
  try {
    const response = await fetch('https://aiproxy.bja.sealos.run/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        stream: false,
        max_tokens: 512,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error('API返回数据格式异常');
    }
  } catch (error) {
    console.error('AI API调用失败:', error);
    throw error;
  }
};

// 生成题目的主函数
export const generateQuestionWithAI = async (params: {
  category: 'couple' | 'friendship';
  excludeHistory?: string[];
}): Promise<Question> => {
  const { category, excludeHistory = [] } = params;
  
  try {
    // 构建提示词
    const promptParams: QuestionPrompt = {
      category,
      context: excludeHistory.length > 0 ? 
        `请避免生成与以下题目类似的问题：${excludeHistory.slice(0, 5).join('、')}` : 
        undefined
    };
    
    const prompt = buildPrompt(promptParams);
    
    // 调用AI生成
    const content = await callRealAI(prompt);
    
    // 创建题目对象
    const question: Question = {
      id: generateId(),
      category,
      content: content.trim(),
      timestamp: Date.now()
    };
    
    return question;
  } catch (error) {
    console.error('AI生成题目失败:', error);
    throw error;
  }
};

// AI服务可用性检查
export const checkAIAvailability = async (): Promise<boolean> => {
  const API_TOKEN = import.meta.env.VITE_AI_TOKEN || '';
  
  if (!API_TOKEN) {
    console.warn('AI API token未配置');
    return false;
  }
  
  try {
    // 发送一个简单的测试请求
    const response = await fetch('https://aiproxy.bja.sealos.run/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ 
          role: 'user', 
          content: '测试连接' 
        }],
        stream: false,
        max_tokens: 10,
        temperature: 0.1
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('AI服务检查失败:', error);
    return false;
  }
};