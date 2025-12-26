
import React, { useEffect, useState } from 'react';
import { RANKS } from '../types';

interface PromotionViewProps {
  rankIndex: number;
  onComplete: () => void;
}

export const PromotionView: React.FC<PromotionViewProps> = ({ rankIndex, onComplete }) => {
  const currentRank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1];
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
      {!showScroll ? (
        <div className="animate-in zoom-in fade-in duration-1000 space-y-6">
          <div className="text-8xl animate-bounce">📜</div>
          <h2 className="font-calligraphy text-6xl text-yellow-400 tracking-widest drop-shadow-lg">圣旨到！</h2>
          <p className="text-white font-serif text-xl italic tracking-[0.2em]">尔治下有功，朝廷闻之大悦...</p>
        </div>
      ) : (
        <div className="animate-in slide-in-from-top duration-1000 w-full max-w-sm bg-[#fff9e6] rounded-sm shadow-[0_0_50px_rgba(255,215,0,0.3)] border-x-[12px] border-yellow-700 p-8 flex flex-col items-center space-y-8 relative ink-border">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-800 via-yellow-400 to-yellow-800"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-800 via-yellow-400 to-yellow-800"></div>
          
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-xl">
            <span className="text-yellow-400 font-calligraphy text-3xl">诏</span>
          </div>

          <h3 className="font-calligraphy text-4xl text-gray-900 border-b-2 border-gray-300 pb-2">升迁嘉诏</h3>

          <div className="font-serif text-gray-800 text-lg leading-loose text-left tracking-widest w-full">
            <p>奉天承运，皇帝诏曰：</p>
            <p className="mt-4 indent-8">
              青云之守 <span className="font-bold text-red-900">{currentRank}</span> 勤勉于政，农工商学并进，民生鼎沸，实乃社稷之幸。
            </p>
            <p className="mt-4 indent-8">
              兹敕升尔为 <span className="font-bold text-red-900 text-2xl underline decoration-double">{nextRank}</span>，望尔履新后更思报国，不负朕望。
            </p>
            <p className="text-right mt-10 text-sm opacity-60 italic">—— 景佑十五年 秋</p>
          </div>

          <button 
            onClick={onComplete}
            className="w-full py-5 bg-red-900 text-white font-calligraphy text-3xl rounded-full shadow-2xl hover:bg-red-950 active:scale-95 transition-all border-b-4 border-black animate-pulse"
          >
            领旨 · 赴任
          </button>
        </div>
      )}
    </div>
  );
};
