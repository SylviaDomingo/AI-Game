
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex flex-col h-full relative">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-40">
        <div className="text-center py-2">
          <span className="bg-gray-200/50 px-3 py-1 rounded-full text-[10px] text-gray-500 font-bold tracking-widest uppercase">
            奇案交互推理 · {currentScenario.subject}
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-500`}
          >
            <div className={`flex max-w-[85%] items-start space-x-2 ${msg.sender === 'player' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg border border-gray-300 flex-shrink-0 bg-white overflow-hidden shadow-sm">
                <img src={msg.sender === 'player' ? ASSETS.images.magistratePortrait : activeNPC.portrait} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className={`p-4 rounded-2xl shadow-sm font-serif leading-relaxed ${
                msg.sender === 'player' 
                  ? 'bg-red-900 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input/Selection Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f4ece1] via-[#f4ece1] to-transparent z-10">
        {!isSolved ? (
          <div className="space-y-2 bg-white/80 backdrop-blur-md p-4 rounded-3xl border-2 border-gray-800 shadow-2xl ink-border">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center mb-2">请选择县令的询问方向</p>
            {currentScenario.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={usedOptions.includes(idx)}
                className={`w-full p-4 rounded-xl text-left font-serif transition-all border-2 text-sm ${
                  usedOptions.includes(idx) 
                    ? 'opacity-40 bg-gray-100 border-gray-200 scale-95' 
                    : 'bg-white border-gray-300 hover:border-gray-800 active:scale-95 shadow-sm'
                }`}
              >
                <span className="font-bold mr-2 text-red-900">{String.fromCharCode(65 + idx)}.</span>
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#fffbf2] border-2 border-gray-800 shadow-2xl animate-in zoom-in duration-500">
             <div className="flex items-center space-x-2 mb-3">
               <span className="text-2xl">📖</span>
               <p className="font-bold text-gray-500 tracking-widest uppercase text-xs">【 夫子点评 · {currentScenario.knowledgePoint} 】</p>
             </div>
             <p className="text-gray-800 leading-relaxed font-serif text-sm bg-white/50 p-3 rounded-lg border border-dashed border-gray-300">
               {currentScenario.educationalNote}
             </p>
             <button 
              onClick={onCloseCase} 
              className="w-full mt-4 py-4 bg-gray-900 text-white rounded-xl font-calligraphy text-2xl shadow-xl hover:bg-black active:scale-95 transition-all"
            >
              朱批 · 结案
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
