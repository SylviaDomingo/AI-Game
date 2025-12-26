
import React, { useState } from 'react';
import { GameState } from '../types';
import { ASSETS } from '../constants/assets';
import { TimeIndicator } from './TimeIndicator';

interface GameHeaderProps {
  state: GameState;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ state, isMuted, onToggleMute }) => {
  const [showSkills, setShowSkills] = useState(false);

  return (
    <div className="bg-[#dcd3c1]/95 backdrop-blur-md border-b-2 border-gray-800 sticky top-0 z-30 shadow-md">
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowSkills(!showSkills)}
            className="animate-portrait-idle focus:outline-none group relative"
          >
            <img src={ASSETS.images.magistratePortrait} alt="Magistrate" className="w-10 h-10 rounded-full border border-gray-600 bg-white shadow-sm group-hover:ring-2 group-hover:ring-red-900 transition-all" />
            <div className="absolute -bottom-1 -right-1 bg-red-900 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {showSkills ? '▲' : '▼'}
            </div>
          </button>
          <div className="flex flex-col">
            <span className="font-calligraphy text-base leading-tight">{state.playerName} 县令</span>
            <TimeIndicator time={state.currentTime} day={state.day} />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleMute}
            className={`w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center transition-all active:scale-90 ${isMuted ? 'bg-gray-200 opacity-50' : 'bg-white shadow-sm'}`}
          >
            <span className="text-sm">{isMuted ? '🔇' : '🎵'}</span>
          </button>

          <div className="flex space-x-3 bg-white/40 px-3 py-1 rounded-xl border border-gray-300">
            <div className="text-center min-w-[32px]">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">政绩</p>
              <p className="font-bold text-red-900 text-xs">{state.currentScore}</p>
            </div>
            <div className="w-px h-6 bg-gray-300 self-center"></div>
            <div className="text-center min-w-[32px]">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">民望</p>
              <p className="font-bold text-blue-900 text-xs">{state.reputation}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Governing Skills Panel */}
      {showSkills && (
        <div className="bg-[#f4ece1] p-3 grid grid-cols-4 gap-2 border-t border-gray-300 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg border border-gray-200">
            <span className="text-lg">🌾</span>
            <span className="text-[10px] font-bold text-gray-500">农业</span>
            <span className="font-serif font-bold text-green-900">{state.skills.agriculture}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg border border-gray-200">
            <span className="text-lg">💰</span>
            <span className="text-[10px] font-bold text-gray-500">财政</span>
            <span className="font-serif font-bold text-amber-900">{state.skills.finance}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg border border-gray-200">
            <span className="text-lg">🏮</span>
            <span className="text-[10px] font-bold text-gray-500">民生</span>
            <span className="font-serif font-bold text-blue-900">{state.skills.livelihood}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white/60 rounded-lg border border-gray-200">
            <span className="text-lg">📜</span>
            <span className="text-[10px] font-bold text-gray-500">文化</span>
            <span className="font-serif font-bold text-purple-900">{state.skills.culture}</span>
          </div>
        </div>
      )}
    </div>
  );
};
