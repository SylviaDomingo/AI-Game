
import React from 'react';
import { Location, RANKS } from '../types';
import { ASSETS } from '../constants/assets';

interface MapViewProps {
  rankIndex: number;
  onSelectLocation: (loc: Location) => void;
}

export const MapView: React.FC<MapViewProps> = ({ rankIndex, onSelectLocation }) => {
  const allLocations = [
    { name: Location.Office, top: '48%', left: '50%', icon: '🏛️', minRank: 0 },
    { name: Location.Market, top: '78%', left: '35%', icon: '⚖️', minRank: 0 },
    { name: Location.Bank, top: '80%', left: '65%', icon: '💰', minRank: 0 },
    { name: Location.Suburbs, top: '25%', left: '30%', icon: '🏔️', minRank: 0 },
    { name: Location.Farmland, top: '23%', left: '70%', icon: '🌾', minRank: 0 },
    { name: Location.Academy, top: '55%', left: '15%', icon: '📖', minRank: 1 },
    { name: Location.ImperialCity, top: '15%', left: '50%', icon: '🏮', minRank: 3 },
  ];

  const visibleLocations = allLocations.filter(loc => rankIndex >= loc.minRank);
  const currentRankName = RANKS[rankIndex];

  return (
    <div className="flex flex-col h-full z-40 bg-[#f4ece1] relative overflow-hidden">
      <div className="p-6 bg-[#dcd3c1] border-b-2 border-gray-800 text-center shadow-md">
        <h2 className="font-calligraphy text-4xl text-gray-900 tracking-widest">{currentRankName}·全舆图</h2>
        <p className="text-gray-500 font-serif text-xs mt-1 italic">位极人臣之阶，需尔励精图治</p>
      </div>
      
      <div 
        className="flex-1 relative m-4 rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden ink-border" 
        style={{ 
          backgroundImage: `url(${ASSETS.images.mainBackground})`, 
          backgroundSize: '100% 100%', 
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {visibleLocations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => onSelectLocation(loc.name)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-500 hover:scale-110"
            style={{ top: loc.top, left: loc.left }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 bg-white/80 border-gray-800 text-gray-800 group-hover:bg-gray-800 group-hover:text-white transition-colors">
              {loc.icon}
            </div>
            <div className="mt-2 px-3 py-0.5 rounded-full border-2 border-gray-800 font-calligraphy text-lg bg-white/90 text-gray-800 group-hover:bg-gray-800 group-hover:text-white transition-colors shadow-md">
              {loc.name}
            </div>
          </button>
        ))}

        {allLocations.filter(loc => rankIndex < loc.minRank).map((loc) => (
          <div
            key={loc.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-30 grayscale pointer-events-none"
            style={{ top: loc.top, left: loc.left }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 border-dashed border-gray-500">
              🔒
            </div>
            <div className="mt-1 px-2 py-0.5 text-[8px] font-bold text-gray-500 bg-white/50 rounded-full">
              {RANKS[loc.minRank]}解锁
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
