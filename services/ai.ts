
import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, GradeLevel, Subject, Location } from "../types";

export const generateMagistrateCase = async (
  grade: GradeLevel,
  subject: Subject,
  knowledgePoint: string,
  location: Location
): Promise<Scenario> => {
  // Creating instance here ensures it uses the most up-to-date environment state
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    你是一位资深的儿童教育游戏策划，擅长将教育知识点融入中国古代侦探故事。
    请生成一个中国古代教育游戏场景。玩家是县令，正在解决纠纷。
    
    当前地点：[${location}]
    学科：[${subject}]，适合[${grade}]水平。
    核心知识点：[${knowledgePoint}]。

    请随机选择一种题型生成，特别是注重'mystery'类型的逻辑连贯性：
    1. 'choice' (选择题): 经典的公堂断案。
    2. 'boolean' (是非判断): 乡亲描述知识点，判断正误。
    3. 'fill' (填空题): 对话或公文挖空（请用'___'作为占位符）。
    4. 'mystery' (海龟汤交互推理): 这是一个多轮互动的对话逻辑。
       - description: 提供一个令人困惑或悬疑的开头（汤面）。
       - question: 县令需要问：“此事真相究竟如何？”
       - options: 
         - 提供3个选项，每个选项代表县令的一种“质疑”或“调查方向”。
         - 只有一个是通往真相（汤底）的“关键突破”。
         - 另外两个是“误区”或“次要线索”。
         - 重点：对于错误选项，必须在 'hint' 字段提供 NPC 的自然回复。NPC 应以对话的形式指出逻辑漏洞，并提供一个引导性提示，但绝不能说出正确答案，也不能让玩家出戏。
         - feedback: 选项被选中后的最终解释（汤底）。

    输出JSON格式，风格古风半文言，浅显生动，确保逻辑严密且富有教育意义。
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        // Removing thinkingBudget to prevent potential 500 errors caused by sandbox timeouts
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

    const text = response.text;
    if (!text) {
      throw new Error("AI returned empty content");
    }

    return JSON.parse(text.trim()) as Scenario;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
