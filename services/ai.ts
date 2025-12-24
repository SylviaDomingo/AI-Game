
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Scenario, GradeLevel, Subject, Location } from "../types";

// 播放 PCM 音频的内部核心逻辑，支持循环播放选项
export async function playAudio(base64Data: string, loop: boolean = false): Promise<AudioBufferSourceNode | null> {
  try {
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
    source.loop = loop;
    source.connect(audioContext.destination);
    source.start();
    return source;
  } catch (err) {
    console.error("Playback error:", err);
    return null;
  }
}

// 异步生成具有古风韵味的背景音乐
export const generateAmbientMusic = async (): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // 简化指令，避免触发模型内部 500 错误（过度约束有时会导致生成失败）
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: "请用极其轻柔、缓慢、悠长的'唔'声哼唱一段具有中国古风禅意的旋律，听起来像是在远山传来的箫声，不要有任何歌词或说话声，节奏极其缓慢平稳。" }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Music Generation Error:", error);
    // 如果失败，返回 null 让应用层处理（通常是静音或使用默认资源）
    return null;
  }
};

// 异步生成语音数据而不播放
export const generateSpeech = async (adj:string, text: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `用${adj}的中国古代口音说: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Generation Error:", error);
    return null;
  }
};

// 即时生成并播放
export const speakPhrase = async (adj:string, text: string) => {
  const audioData = await generateSpeech(adj,text);
  if (audioData) {
    await playAudio(audioData);
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

    请随机选择一种题型生成：
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
