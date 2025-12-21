
import React from 'react';
import { Location } from '../types';
import { ASSETS } from '../constants/assets';

interface MapViewProps {
  currentLocation: Location;
  onSelectLocation: (loc: Location) => void;
}

export const MapView: React.FC<MapViewProps> = ({ currentLocation, onSelectLocation }) => {
  const locations = [
    { name: Location.Office, top: '48%', left: '50%', icon: '🏛️', desc: '处理政务与卷宗' },
    { name: Location.Market, top: '78%', left: '35%', icon: '⚖️', desc: '体察民情与交易' },
    { name: Location.Bank, top: '80%', left: '65%', icon: '💰', desc: '清查账目与金石' },
    { name: Location.Suburbs, top: '25%', left: '30%', icon: '🏔️', desc: '巡视古迹与山川' },
    { name: Location.Farmland, top: '23%', left: '70%', icon: '🌾', desc: '察看农事与节气' },
  ];

  return (
    <div className="flex flex-col h-full z-40 bg-[#f4ece1] relative overflow-hidden">
      <div className="p-6 bg-[#dcd3c1] border-b-2 border-gray-800 text-center shadow-md">
        <h2 className="font-calligraphy text-4xl text-gray-900 tracking-widest">青云县全舆图</h2>
        <p className="text-gray-500 font-serif text-xs mt-1 italic">点击地名，即可走马上任巡视</p>
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
        {locations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => onSelectLocation(loc.name)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-500 ${currentLocation === loc.name ? 'scale-125 z-20' : 'hover:scale-110'}`}
            style={{ top: loc.top, left: loc.left }}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 transition-colors ${currentLocation === loc.name ? 'bg-red-900 border-white text-white rotate-12 shadow-red-900/40' : 'bg-white/80 border-gray-800 text-gray-800 group-hover:bg-gray-800 group-hover:text-white'}`}>
              {loc.icon}
            </div>
            <div className={`mt-2 px-3 py-0.5 rounded-full border-2 border-gray-800 font-calligraphy text-lg transition-colors ${currentLocation === loc.name ? 'bg-red-900 text-white shadow-md' : 'bg-white/90 text-gray-800 group-hover:bg-gray-800 group-hover:text-white'}`}>
              {loc.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
