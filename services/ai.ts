
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
    你是一位资深的儿童教育游戏策划。
    请生成一个中国古代教育游戏场景。玩家是县令，正在解决纠纷。
    
    当前地点：[${location}]
    学科：[${subject}]，适合[${grade}]水平。
    核心知识点：[${knowledgePoint}]。

    请从以下三种题型中随机选择一种生成：
    1. 'choice' (选择题): 经典的公堂断案，三选一。
    2. 'boolean' (是非判断): 乡亲的一段话里包含一个关于知识点的描述，判断其真伪。选项只有“正确”和“错误”。
    3. 'fill' (填空题): 在对话或公文描述中挖掉一个关键点，用'___'表示。选项是需要填入的词句。

    输出JSON格式，包含以下字段：
    - type: 'choice' | 'boolean' | 'fill'
    - title: 场景标题
    - villagerName: 乡亲姓名（古风）
    - description: 事情经过
    - question: 核心提问（如果是填空题，必须包含 '___'）
    - options: 数组。选择题和填空题提供3个选项；是非题提供2个选项（正确和错误）。每个选项包含 text, isCorrect, feedback。
    - educationalNote: 夫子点评，详细解释该知识点。
    - subject: 学科名
    - knowledgePoint: 知识点名

    要求：古风半文言风格，浅显生动。
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
          type: { type: Type.STRING, enum: ['choice', 'boolean', 'fill'] },
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
                feedback: { type: Type.STRING }
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
