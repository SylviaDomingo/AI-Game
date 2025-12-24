
import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, GradeLevel, Subject, Location } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMagistrateCase = async (
  grade: GradeLevel,
  subject: Subject,
  knowledgePoint: string,
  location: Location
): Promise<Scenario> => {
  const prompt = `
    你是一位资深的儿童教育游戏策划，擅长将教育知识点融入中国古代侦探故事。
    请生成一个中国古代教育游戏场景。玩家是县令，正在解决纠纷。
    
    当前地点：[${location}]
    学科：[${subject}]，适合[${grade}]水平。
    核心知识点：[${knowledgePoint}]。

    请从以下四种题型中随机选择一种生成：
    1. 'mystery' (海龟汤交互推理): 这是一个多轮互动的对话逻辑。
       - description: 提供一个令人困惑或悬疑的开头（汤面）。
       - question: 县令需要问：“此事真相究竟如何？”
       - options: 
         - 提供3个选项，每个选项代表县令的一种“质疑”或“调查方向”。
         - 只有一个是通往真相（汤底）的“关键突破”。
         - 另外两个是“误区”或“次要线索”。
         - 重点：对于错误选项，必须在 'hint' 字段提供 NPC 的自然回复。NPC 应以对话的形式指出逻辑漏洞，并提供一个引导性提示，但绝不能说出正确答案。
         - feedback: 选项被选中后的最终解释。

    输出JSON格式，风格古风半文言，浅显生动。
    `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 8000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['choice', 'boolean', 'fill', 'mystery'] },
          title: { type: Type.STRING },
          villagerName: { type: Type.STRING },
          description: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING },
                hint: { type: Type.STRING }
              },
              required: ["text", "isCorrect", "feedback"]
            }
          },
          educationalNote: { type: Type.STRING },
          subject: { type: Type.STRING },
          knowledgePoint: { type: Type.STRING }
        },
        required: ["type", "title", "villagerName", "description", "question", "options", "educationalNote", "subject", "knowledgePoint"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as Scenario;
};
