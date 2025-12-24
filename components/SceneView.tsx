
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
  const bgImage = ASSETS.images.backgrounds[gameState.currentLocation] || ASSETS.images.mainBackground;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Immersive Scene Background Layer - Removed transition classes as requested */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `url(${bgImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Subtle ink wash overlay to unify the aesthetic */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10 p-4 space-y-6 flex-1 flex flex-col animate-in fade-in duration-700 overflow-y-auto">
        {/* Location Header Card */}
        <div 
          className="bg-[#fffbf2]/90 p-5 rounded-2xl border-2 border-gray-800 shadow-xl ink-border backdrop-blur-sm" 
          style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl filter drop-shadow-md">🏮</span>
            <h3 className="font-calligraphy text-3xl text-gray-900 tracking-wider">{gameState.currentLocation}</h3>
          </div>
          <p className="text-gray-800 font-serif text-base leading-relaxed italic border-l-4 border-gray-400 pl-4 py-1">
            {gameState.currentTime === TimeOfDay.Night 
              ? "月上柳梢头，县衙内更声寂寥。唯见几处残灯，该回寝所安歇了。" 
              : `清正廉洁，方显县令本色。此处正是${gameState.currentLocation}，不知有何要务。`}
          </p>
        </div>

        {/* NPC Interaction Grid */}
        <div className="grid grid-cols-2 gap-4">
          {npcs.map(npc => (
            <button 
              key={npc.id}
              onClick={() => onStartCase(npc)}
              className="flex flex-col items-center p-5 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 hover:border-gray-800 hover:bg-white hover:shadow-2xl transition-all active:scale-95 group shadow-lg"
            >
              <div className="animate-portrait-idle group-hover:scale-110 transition-transform mb-3">
                <div className="p-2 bg-white rounded-xl shadow-inner border border-gray-100">
                  <img src={npc.portrait} alt={npc.name} className="w-20 h-20 rounded-lg bg-gray-50" />
                </div>
              </div>
              <span className="font-calligraphy text-2xl text-gray-900 mb-1">{npc.name}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full">{npc.title}</span>
            </button>
          ))}
        </div>

        {/* Empty Scene Message */}
        {npcs.length === 0 && gameState.currentTime !== TimeOfDay.Night && (
          <div className="mt-10 text-center flex flex-col items-center animate-in slide-in-from-bottom duration-500">
            <div className="text-7xl mb-4 opacity-40">🍂</div>
            <p className="font-serif italic text-gray-600 text-lg">此处暂无乡亲寻访，不如去他处巡视。</p>
          </div>
        )}

        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center space-y-4 pb-4">
          {(gameState.currentTime !== TimeOfDay.Night || gameState.currentLocation !== Location.Office )&& (
            <button 
              onClick={onBackToMap}
              className="px-12 py-4 bg-white/95 border-2 border-gray-800 text-gray-900 rounded-full font-calligraphy text-2xl shadow-xl hover:bg-white active:scale-95 transition-all flex items-center space-x-3 group"
            >
              <span className="text-2xl group-hover:rotate-12 transition-transform">🗺️</span>
              <span>返回全舆图</span>
            </button>
          )}

          {gameState.currentTime === TimeOfDay.Night && gameState.currentLocation === Location.Office && (
            <button 
              onClick={onRest} 
              className="px-14 py-6 bg-indigo-950 text-white rounded-full font-calligraphy text-4xl shadow-2xl active:translate-y-1 transition-all border-b-8 border-black hover:bg-indigo-900"
            >
              秉烛而睡 · 休息
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
