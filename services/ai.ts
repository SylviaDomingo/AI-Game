
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Scenario, GradeLevel, Subject, Location } from "../types";

// 辅助函数：解码 Base64 并播放音频
async function decodeAndPlay(base64Data: string) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  
  // Base64 to ArrayBuffer
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // PCM 16bit to Float32
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}

export const speakPhrase = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `用稳重、有礼貌的中国古代口音说: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' 或 'Puck' 在中文语境下通常表现较为自然
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      await decodeAndPlay(base64Audio);
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

export const generateMagistrateCase = async (
  grade: GradeLevel,
  subject: Subject,
  knowledgePoint: string,
  location: Location
): Promise<Scenario> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
         - 重点：对于错误选项，必须在 'hint' 字段提供 NPC 的自然回复。NPC 应以对话的形式指出逻辑漏洞，并提供一个引导性提示，但绝不能说出正确答案，也不能让玩家出戏。
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
