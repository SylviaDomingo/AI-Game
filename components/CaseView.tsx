
import React from 'react';
import { Scenario, NPC } from '../types';
import { ASSETS } from '../constants/assets';

interface CaseViewProps {
  currentScenario: Scenario;
  activeNPC: NPC;
  selectedOption: number | null;
  feedback: string | null;
  onSelectOption: (idx: number) => void;
  onCloseCase: () => void;
}

export const CaseView: React.FC<CaseViewProps> = ({ 
  currentScenario, activeNPC, selectedOption, feedback, onSelectOption, onCloseCase 
}) => {
  return (
    <div className="p-4 space-y-4 pb-20 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="p-6 bg-white/95 rounded-lg border-2 border-gray-800 ink-border shadow-md" style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}>
         <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-red-900 border-2 border-red-900 px-3 py-1 rounded-full">{currentScenario.subject}</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest">QY-CASE-{Math.floor(Math.random()*90000)+10000}</span>
         </div>
         <div className="flex items-start space-x-4 mb-6">
            <img src={activeNPC.portrait} alt="NPC" className="w-16 h-16 rounded-xl border-2 border-gray-400 p-0.5 bg-gray-50 shadow-inner" />
            <div>
              <span className="font-calligraphy text-gray-600 text-sm">【{activeNPC.name}】</span>
              <p className="text-gray-800 font-serif leading-relaxed text-lg mt-1 italic">
                “{currentScenario.description}”
              </p>
            </div>
         </div>

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
        {currentScenario.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectOption(idx)}
            disabled={selectedOption !== null}
            className={`relative p-5 rounded-2xl border-2 transition-all font-serif group overflow-hidden ${
              selectedOption === null 
              ? 'border-gray-300 bg-white/90 hover:border-gray-800 hover:bg-white active:scale-95 shadow-sm' 
              : idx === selectedOption 
                ? opt.isCorrect ? 'border-green-600 bg-green-50 shadow-inner' : 'border-red-600 bg-red-50 shadow-inner'
                : opt.isCorrect ? 'border-green-200 opacity-60' : 'border-gray-200 opacity-30 grayscale'
            } ${currentScenario.type === 'boolean' ? 'py-10 text-3xl font-calligraphy' : 'text-lg'}`}
          >
            <span className="relative z-10">{opt.text}</span>
          </button>
        ))}
      </div>

      {selectedOption !== null && (
        <div className="p-6 rounded-2xl bg-[#fffbf2]/98 border-2 border-gray-400 shadow-2xl animate-in zoom-in duration-300 relative">
          <div className="absolute top-4 right-6 text-6xl opacity-10 select-none font-calligraphy">
            {currentScenario.options[selectedOption].isCorrect ? '明' : '偏'}
          </div>
          <h4 className={`font-calligraphy text-3xl mb-3 ${currentScenario.options[selectedOption].isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {currentScenario.options[selectedOption].isCorrect ? '『 明察秋毫 』' : '『 查无实据 』'}
          </h4>
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
