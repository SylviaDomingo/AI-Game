
import React from 'react';
import { GameState } from '../types';
import { ASSETS } from '../constants/assets';
import { TimeIndicator } from './TimeIndicator';

interface GameHeaderProps {
  state: GameState;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ state, isMuted, onToggleMute }) => (
  <div className="bg-[#dcd3c1]/95 backdrop-blur-md p-3 border-b-2 border-gray-800 flex justify-between items-center sticky top-0 z-30 shadow-md">
    <div className="flex items-center space-x-3">
      <div className="animate-portrait-idle">
        <img src={ASSETS.images.magistratePortrait} alt="Magistrate" className="w-10 h-10 rounded-full border border-gray-600 bg-white shadow-sm" />
      </div>
      <div className="flex flex-col">
        <span className="font-calligraphy text-base leading-tight">{state.playerName} 县令</span>
        <TimeIndicator time={state.currentTime} day={state.day} />
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      {/* 音乐控制按钮 - 移入 Header 内部 */}
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
);
