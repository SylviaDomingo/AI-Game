
import React from 'react';
import { GameState } from '../types';
import { ASSETS } from '../constants/assets';
import { TimeIndicator } from './TimeIndicator';

export const GameHeader: React.FC<{ state: GameState }> = ({ state }) => (
  <div className="bg-[#dcd3c1]/90 backdrop-blur-md p-4 border-b-2 border-gray-800 flex justify-between items-center sticky top-0 z-30 shadow-md">
    <div className="flex items-center space-x-3">
      <div className="animate-portrait-idle">
        <img src={ASSETS.images.magistratePortrait} alt="Magistrate" className="w-10 h-10 rounded-full border border-gray-600 bg-white shadow-sm" />
      </div>
      <div className="flex flex-col">
        <span className="font-calligraphy text-lg">{state.playerName} 县令</span>
        <TimeIndicator time={state.currentTime} day={state.day} />
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex space-x-2 text-right">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">政绩</p>
          <p className="font-bold text-red-900 text-sm">{state.currentScore}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">民望</p>
          <p className="font-bold text-blue-900 text-sm">{state.reputation}%</p>
        </div>
      </div>
    </div>
  </div>
);
