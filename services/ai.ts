
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

// 异步生成具有古风韵味的背景音乐（通过 TTS 模拟空灵旋律）
export const generateAmbientMusic = async (): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // 通过 TTS 模型引导生成一段只有“唔/啊”等轻柔哼唱、不带文字、充满古琴/长笛意境的旋律
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: "请不要说话，只用轻柔、空灵、悠然的‘唔’声，模仿一段中国古代古琴或长笛的恬静旋律，节奏缓慢闲适，营造出一种水墨画般的意境。" }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 选择较为柔和的声音
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Music Generation Error:", error);
    return null;
  }
};

// 异步生成语音数据而不播放
export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `用稳重、有礼貌的中国古代口音说: ${text}` }] }],
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

// 即时生成并播放（用于互动反馈）
export const speakPhrase = async (text: string) => {
  const audioData = await generateSpeech(text);
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

    请随机选择一种题型生成（choice, boolean, fill, mystery）。
    如果是 mystery 类型：
    - description: 提供一个令人困惑或悬疑的开头。
    - question: 县令需要问：“此事真相究竟如何？”
    - options: 提供3个选项。只有一个是通往真相。错误选项需提供 hint (NPC的自然回复)。
    
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
