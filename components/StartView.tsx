
import React, { useState } from 'react';
import { GradeLevel } from '../types';

interface StartViewProps {
  onStart: (name: string, grade: GradeLevel) => void;
}

export const StartView: React.FC<StartViewProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.P1);

  return (
    <div className="flex flex-col h-full p-8 space-y-10 justify-center z-30 bg-[#f4ece1]/90 backdrop-blur-md">
      <div className="text-center space-y-4 animate-in slide-in-from-top duration-1000">
        <div className="w-24 h-24 mx-auto bg-black rounded-full flex items-center justify-center shadow-2xl mb-6">
          <span className="text-white font-calligraphy text-5xl">墨</span>
        </div>
        <h1 className="text-7xl font-calligraphy text-black tracking-tighter">水墨县令</h1>
        <p className="text-gray-600 tracking-[0.6em] font-serif text-[10px] uppercase font-bold">Scholar Magistrate Adventure</p>
      </div>

      <div className="space-y-6 bg-white/70 p-8 rounded-3xl border-2 border-[#8b7355] shadow-2xl ink-border">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">名讳</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="如：苏子瞻" 
            className="w-full p-5 rounded-2xl border-2 border-gray-300 focus:border-gray-800 outline-none font-serif text-xl bg-white/90 shadow-inner" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">管辖年级</label>
          <select 
            value={grade} 
            onChange={(e) => setGrade(e.target.value as GradeLevel)} 
            className="w-full p-5 rounded-2xl border-2 border-gray-300 font-serif bg-white/90 outline-none text-lg"
          >
            {Object.values(GradeLevel).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <button 
          onClick={() => onStart(name, grade)} 
          className="w-full py-6 bg-red-900 text-white rounded-2xl font-calligraphy text-3xl shadow-2xl hover:bg-red-950 active:scale-95 transition-all border-b-8 border-red-950"
        >
          击鼓 · 走马上任
        </button>
      </div>
    </div>
  );
};
