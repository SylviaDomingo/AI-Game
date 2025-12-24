
import React, { useState, useEffect, useRef } from 'react';
import { Scenario, NPC } from '../types';
import { ASSETS } from '../constants/assets';

interface Message {
  id: string;
  sender: 'player' | 'npc';
  text: string;
  timestamp: number;
}

interface MysteryDialogueViewProps {
  currentScenario: Scenario;
  activeNPC: NPC;
  onSelectCorrect: (idx: number) => void;
  onCloseCase: () => void;
}

export const MysteryDialogueView: React.FC<MysteryDialogueViewProps> = ({ 
  currentScenario, activeNPC, onSelectCorrect, onCloseCase 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'start', sender: 'npc', text: currentScenario.description, timestamp: Date.now() }
  ]);
  const [usedOptions, setUsedOptions] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOptionClick = (idx: number) => {
    if (usedOptions.includes(idx) || isSolved) return;

    const opt = currentScenario.options[idx];
    const playerMsg: Message = { id: `p-${idx}`, sender: 'player', text: opt.text, timestamp: Date.now() };
    
    setMessages(prev => [...prev, playerMsg]);
    setUsedOptions(prev => [...prev, idx]);

    setTimeout(() => {
      if (opt.isCorrect) {
        setIsSolved(true);
        const npcMsg: Message = { 
          id: `n-correct`, 
          sender: 'npc', 
          text: `“大人圣明！真相正是如此：${opt.feedback}”`, 
          timestamp: Date.now() 
        };
        setMessages(prev => [...prev, npcMsg]);
        new Audio(ASSETS.audio.correct).play().catch(() => {});
        onSelectCorrect(idx);
      } else {
        const npcMsg: Message = { 
          id: `n-hint-${idx}`, 
          sender: 'npc', 
          text: opt.hint || "大人所言甚是，但这其中似乎还缺了点什么，不妨再换个角度想想？", 
          timestamp: Date.now() 
        };
        setMessages(prev => [...prev, npcMsg]);
        new Audio(ASSETS.audio.wrong).play().catch(() => {});
      }
    }, 600);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pt-2 pb-6 custom-scrollbar">
        <div className="text-center py-2">
          <span className="bg-gray-200/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] text-gray-600 font-bold tracking-[0.2em] uppercase border border-gray-300">
            奇案交互推理 · {currentScenario.subject}
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-500`}
          >
            <div className={`flex max-w-[88%] items-start space-x-2 ${msg.sender === 'player' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-xl border-2 border-gray-400 flex-shrink-0 bg-white overflow-hidden shadow-md">
                <img src={msg.sender === 'player' ? ASSETS.images.magistratePortrait : activeNPC.portrait} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className={`p-4 rounded-2xl shadow-lg font-serif leading-relaxed text-base border-2 ${
                msg.sender === 'player' 
                  ? 'bg-red-900 text-white rounded-tr-none border-red-950' 
                  : 'bg-white text-gray-800 rounded-tl-none border-gray-200'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} className="h-4" />
      </div>

      {/* Inquiry Selection / Result Area (Fixed Bottom) */}
      <div className="p-4 border-t border-[#f4ece1]/95">
        {!isSolved ? (
          <div className="space-y-2 bg-white/90 backdrop-blur-md p-5 rounded-3xl border-2 border-gray-800 shadow-2xl ink-border ring-4 ring-black/5">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-px w-8 bg-gray-300"></div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">请选择县令的询问方向</p>
              <div className="h-px w-8 bg-gray-300"></div>
            </div>
            
            {currentScenario.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={usedOptions.includes(idx)}
                className={`w-full p-4 rounded-xl text-left font-serif transition-all border-2 text-base relative group ${
                  usedOptions.includes(idx) 
                    ? 'opacity-40 bg-gray-100 border-gray-200 cursor-not-allowed' 
                    : 'bg-white border-gray-300 hover:border-gray-800 active:scale-95 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start">
                  <span className={`font-bold mr-3 ${usedOptions.includes(idx) ? 'text-gray-400' : 'text-red-900'}`}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </div>
                {!usedOptions.includes(idx) && (
                  <div className="absolute right-3 bottom-1 text-[10px] text-gray-300 font-bold italic opacity-0 group-hover:opacity-100 transition-opacity">点击质询</div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#fffbf2] border-2 border-gray-800 shadow-2xl animate-in zoom-in duration-500 ring-4 ring-black/5">
             <div className="flex items-center space-x-2 mb-4">
               <span className="text-2xl filter drop-shadow-sm">📖</span>
               <p className="font-bold text-gray-600 tracking-widest uppercase text-xs">【 夫子点评 · {currentScenario.knowledgePoint} 】</p>
             </div>
             <p className="text-gray-800 leading-relaxed font-serif text-base bg-white/60 p-4 rounded-xl border border-dashed border-gray-400 shadow-inner">
               {currentScenario.educationalNote}
             </p>
             <button 
              onClick={onCloseCase} 
              className="w-full mt-5 py-5 bg-gray-900 text-white rounded-2xl font-calligraphy text-2xl shadow-xl hover:bg-black active:scale-95 transition-all border-b-4 border-black"
            >
              朱批 · 结案
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
