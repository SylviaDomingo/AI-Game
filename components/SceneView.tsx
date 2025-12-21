
import React from 'react';
import { GameState, NPC, Location, TimeOfDay } from '../types';
import { ASSETS } from '../constants/assets';

interface SceneViewProps {
  gameState: GameState;
  npcs: NPC[];
  onBackToMap: () => void;
  onStartCase: (npc: NPC) => void;
  onRest: () => void;
}

export const SceneView: React.FC<SceneViewProps> = ({ gameState, npcs, onBackToMap, onStartCase, onRest }) => {
  return (
    <div className="p-4 space-y-6 flex-1 animate-in fade-in duration-500">
      <div className="bg-[#fffbf2]/95 p-5 rounded-xl border-2 border-gray-800 shadow-lg ink-border" style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl">🏮</span>
          <h3 className="font-calligraphy text-2xl text-gray-800">{gameState.currentLocation}</h3>
        </div>
        <p className="text-gray-600 font-serif text-sm leading-relaxed italic border-l-2 border-gray-300 pl-3">
          {gameState.currentTime === TimeOfDay.Night 
            ? "月上柳梢头，县衙内更声寂寥。唯见几处残灯，该回寝所安歇了。" 
            : `清正廉洁，方显县令本色。此处正是${gameState.currentLocation}，不知有何要务。`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {npcs.map(npc => (
          <button 
            key={npc.id}
            onClick={() => onStartCase(npc)}
            className="flex flex-col items-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-300 hover:bg-white/90 hover:shadow-md transition-all active:scale-95 group"
          >
            <div className="animate-portrait-idle group-hover:scale-110 transition-transform">
              <img src={npc.portrait} alt={npc.name} className="w-20 h-20 rounded-lg mb-2 shadow-sm bg-gray-50 p-1" />
            </div>
            <span className="font-calligraphy text-lg text-gray-800">{npc.name}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{npc.title}</span>
          </button>
        ))}
      </div>

      {npcs.length === 0 && gameState.currentTime !== TimeOfDay.Night && (
        <div className="mt-10 text-center opacity-40 flex flex-col items-center">
          <div className="text-6xl mb-4">🍂</div>
          <p className="font-serif italic">此处暂无乡亲寻访，不如去他处巡视。</p>
        </div>
      )}

      {gameState.currentTime !== TimeOfDay.Night && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={onBackToMap}
            className="px-10 py-4 bg-white/90 border-2 border-gray-800 text-gray-800 rounded-full font-calligraphy text-xl shadow-lg hover:bg-white active:scale-95 transition-all flex items-center space-x-2"
          >
            <span>🗺️</span>
            <span>返回全舆图</span>
          </button>
        </div>
      )}

      {gameState.currentTime === TimeOfDay.Night && gameState.currentLocation === Location.Office && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={onRest} 
            className="px-12 py-5 bg-indigo-950 text-white rounded-full font-calligraphy text-3xl shadow-2xl active:translate-y-1 transition-all border-b-4 border-black"
          >
            秉烛而睡 · 休息
          </button>
        </div>
      )}
    </div>
  );
};
