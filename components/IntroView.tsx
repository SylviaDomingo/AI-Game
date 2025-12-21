
import React, { useState, useEffect } from 'react';
import { ASSETS } from '../constants/assets';

interface IntroViewProps {
  playerName: string;
  onComplete: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ playerName, onComplete }) => {
  const [step, setStep] = useState(0);
  const narrative = [
    `大成十四年，岁在壬寅。`,
    `${playerName}，尔本寒窗苦读十载，终登龙虎榜，得中进士。`,
    `圣上嘉尔才学，特命尔执掌“青云县”，任知县一职。`,
    `此地民风淳朴，然学风日渐颓废。尔当断民之冤，兴学之礼，方不负朕之厚望。`,
    `即刻启程，领旨谢恩！`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= narrative.length - 1) {
          clearInterval(timer);
          return s;
        }
        return s + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [narrative.length]);

  return (
    <div className="flex flex-col h-full p-10 justify-center z-40 bg-[#f4ece1] text-gray-900 font-serif text-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 grayscale select-none"
        style={{ backgroundImage: `url(${ASSETS.images.mainBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto">
        <div className="min-h-[420px] flex flex-col items-center justify-center space-y-10">
          {narrative.slice(0, step + 1).map((line, idx) => (
            <p key={idx} className={`text-xl leading-relaxed tracking-[0.3em] animate-in fade-in slide-in-from-bottom duration-1000 ${idx === step ? 'text-red-900 font-bold' : 'opacity-40 grayscale'}`}>
              {line}
            </p>
          ))}
        </div>
        
        {step === narrative.length - 1 && (
          <div className="mt-12 animate-in zoom-in fade-in duration-700">
            <button 
              onClick={onComplete}
              className="px-12 py-5 bg-gray-900 text-white font-calligraphy text-3xl rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border-b-4 border-black"
            >
              领旨 · 入舆图
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
