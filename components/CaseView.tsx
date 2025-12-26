
import React, { useState } from 'react';
import { Scenario, NPC } from '../types';
import { ASSETS } from '../constants/assets';
import { playAudio } from '../services/ai';

interface CaseViewProps {
  currentScenario: Scenario;
  activeNPC: NPC;
  successAudioData: string | null;
  skillGainHint: string | null;
  selectedOption: number | null;
  feedback: string | null;
  onSelectOption: (idx: number) => void;
  onCloseCase: () => void;
}

export const CaseView: React.FC<CaseViewProps> = ({ 
  currentScenario, activeNPC, successAudioData, skillGainHint, selectedOption, feedback, onSelectOption, onCloseCase 
}) => {
  const [mysteryHint, setMysteryHint] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<number[]>([]);

  const handleOptionClick = (idx: number) => {
    const opt = currentScenario.options[idx];
    if (opt.isCorrect && successAudioData) {
      playAudio(successAudioData);
    }
    onSelectOption(idx);
  };

  const handleMysteryClick = (idx: number) => {
    const opt = currentScenario.options[idx];
    if (opt.isCorrect) {
      setMysteryHint(null);
      if (successAudioData) {
        playAudio(successAudioData);
      }
      onSelectOption(idx);
    } else {
      setMysteryHint(opt.hint || "此事或有蹊跷，大人不妨再思量一二。");
      setWrongAttempts(prev => [...new Set([...prev, idx])]);
      new Audio(ASSETS.audio.wrong).play().catch(() => {});
    }
  };

  const isMystery = currentScenario.type === 'mystery';

  return (
    <div className="p-4 space-y-4 pb-20 animate-in slide-in-from-bottom duration-500 overflow-y-auto h-full">
      <div className="p-6 bg-white/95 rounded-lg border-2 border-gray-800 ink-border shadow-md" style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}>
         <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-red-900 border-2 border-red-900 px-3 py-1 rounded-full">
              {isMystery ? '【 奇案推理 】' : currentScenario.subject}
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest">QY-CASE-{Math.floor(Math.random()*90000)+10000}</span>
         </div>
         
         <div className="flex items-start space-x-4 mb-6">
            <div className="relative">
              <img src={activeNPC.portrait} alt="NPC" className="w-16 h-16 rounded-xl border-2 border-gray-400 p-0.5 bg-gray-50 shadow-inner" />
              {isMystery && mysteryHint && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce shadow-md">!</div>
              )}
            </div>
            <div>
              <span className="font-calligraphy text-gray-600 text-sm">【{activeNPC.name}】</span>
              <p className="text-gray-800 font-serif leading-relaxed text-lg mt-1 italic">
                “{currentScenario.description}”
              </p>
            </div>
         </div>

         {isMystery && mysteryHint && selectedOption === null && (
           <div className="mb-4 animate-in fade-in slide-in-from-top duration-300">
             <div className="relative bg-gray-800 text-white p-4 rounded-2xl text-sm font-serif italic shadow-lg">
               <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-800 rotate-45"></div>
               “{mysteryHint}”
             </div>
           </div>
         )}

         <div className="mt-4 p-5 bg-[#f8f5f0] rounded-xl border-l-8 border-gray-800 shadow-inner">
            {currentScenario.type === 'fill' ? (
              <div className="font-bold text-gray-900 text-xl leading-relaxed font-serif">
                {currentScenario.question.split('___').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={`inline-block min-w-[100px] border-b-4 border-gray-800 mx-2 text-center transition-all ${selectedOption !== null ? 'text-red-900' : 'animate-pulse text-transparent bg-gray-200'}`}>
                        {selectedOption !== null ? currentScenario.options[selectedOption].text : '？'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="font-bold text-gray-900 text-xl font-serif leading-snug">{currentScenario.question}</p>
            )}
         </div>
      </div>

      <div className={`grid gap-4 ${currentScenario.type === 'boolean' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {currentScenario.options.map((opt, idx) => {
          const isWrongAttempt = wrongAttempts.includes(idx);
          const isFinalSelected = selectedOption === idx;

          return (
            <button
              key={idx}
              onClick={() => isMystery ? handleMysteryClick(idx) : handleOptionClick(idx)}
              disabled={selectedOption !== null || (isMystery && isWrongAttempt)}
              className={`relative p-5 rounded-2xl border-2 transition-all font-serif group overflow-hidden text-left ${
                selectedOption === null 
                ? isWrongAttempt 
                  ? 'border-gray-200 bg-gray-100 opacity-50 grayscale'
                  : 'border-gray-300 bg-white/90 hover:border-gray-800 hover:bg-white active:scale-95 shadow-sm' 
                : isFinalSelected 
                  ? opt.isCorrect ? 'border-green-600 bg-green-50 shadow-inner' : 'border-red-600 bg-red-50 shadow-inner'
                  : opt.isCorrect ? 'border-green-200 opacity-60' : 'border-gray-200 opacity-30 grayscale'
              } ${currentScenario.type === 'boolean' ? 'py-10 text-3xl font-calligraphy text-center' : 'text-lg'}`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${
                  isFinalSelected && opt.isCorrect ? 'bg-green-600 text-white border-green-600' : 
                  isFinalSelected && !opt.isCorrect ? 'bg-red-600 text-white border-red-600' :
                  isWrongAttempt ? 'bg-gray-400 text-white border-gray-400' : 'bg-white text-gray-800 border-gray-800'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="relative z-10 flex-1">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="p-6 rounded-2xl bg-[#fffbf2]/98 border-2 border-gray-400 shadow-2xl animate-in zoom-in duration-300 relative">
          <div className="absolute top-4 right-6 text-6xl opacity-10 select-none font-calligraphy">
            {currentScenario.options[selectedOption].isCorrect ? '明' : '偏'}
          </div>
          <div className="flex justify-between items-start mb-3">
            <h4 className={`font-calligraphy text-3xl ${currentScenario.options[selectedOption].isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {currentScenario.options[selectedOption].isCorrect ? '『 明察秋毫 』' : '『 查无实据 』'}
            </h4>
            {currentScenario.options[selectedOption].isCorrect && skillGainHint && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-sm border border-green-200">
                {skillGainHint}
              </span>
            )}
          </div>
          <p className="text-gray-700 italic mb-6 font-serif border-l-4 border-gray-200 pl-4">“{feedback}”</p>
          <div className="bg-white/80 p-4 rounded-xl text-sm border-2 border-dashed border-gray-300 shadow-inner">
             <p className="font-bold text-gray-500 mb-2 tracking-widest uppercase text-xs">【夫子点评 · {currentScenario.knowledgePoint}】</p>
             <p className="text-gray-800 leading-relaxed font-serif text-base">{currentScenario.educationalNote}</p>
          </div>
          <button 
            onClick={onCloseCase} 
            className="w-full mt-6 py-5 bg-gray-900 text-white rounded-2xl font-calligraphy text-2xl shadow-xl hover:bg-black active:scale-95 transition-all"
          >
            朱批 · 结案
          </button>
        </div>
      )}
    </div>
  );
};
