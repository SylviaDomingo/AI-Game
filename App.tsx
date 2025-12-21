
import React, { useState, useEffect } from 'react';
import { GradeLevel, Subject, Scenario, GameState, Location, TimeOfDay, NPC } from './types';
import { CURRICULUM } from './data/curriculum';
import { generateMagistrateCase } from './services/ai';
import { ASSETS } from './constants/assets';
import { NPCS } from './data/npcs';

// --- Sub-components ---

const TimeIndicator: React.FC<{ time: TimeOfDay; day: number }> = ({ time, day }) => {
  const timeColors: Record<TimeOfDay, string> = {
    [TimeOfDay.Morning]: 'bg-amber-100 text-amber-900 border-amber-300',
    [TimeOfDay.Noon]: 'bg-blue-100 text-blue-900 border-blue-300',
    [TimeOfDay.Dusk]: 'bg-orange-200 text-orange-900 border-orange-400',
    [TimeOfDay.Night]: 'bg-indigo-900 text-indigo-100 border-indigo-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full border text-xs font-bold shadow-sm transition-all duration-1000 ${timeColors[time]}`}>
      第 {day} 天 · {time}
    </div>
  );
};

const GameHeader: React.FC<{ state: GameState; onOpenMap: () => void }> = ({ state, onOpenMap }) => (
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
          <p className="text-[10px] text-gray-500 font-bold uppercase">政绩</p>
          <p className="font-bold text-red-900 text-sm">{state.currentScore}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase">民望</p>
          <p className="font-bold text-blue-900 text-sm">{state.reputation}%</p>
        </div>
      </div>
      <button 
        onClick={onOpenMap}
        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all active:scale-90"
        title="地图"
      >
        <span className="text-xs font-calligraphy">舆图</span>
      </button>
    </div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [view, setView] = useState<'start' | 'intro' | 'map' | 'loading' | 'scene' | 'case'>('start');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);

  const startNewGame = (name: string, grade: GradeLevel) => {
    setGameState({
      playerName: name || '张县令',
      grade,
      currentScore: 0,
      reputation: 80,
      casesSolved: 0,
      currentLocation: Location.Office,
      currentTime: TimeOfDay.Morning,
      day: 1
    });
    setView('intro');
  };

  const advanceTime = () => {
    setGameState(prev => {
      if (!prev) return null;
      const times = Object.values(TimeOfDay);
      const currentIndex = times.indexOf(prev.currentTime);
      if (currentIndex < times.length - 1) {
        return { ...prev, currentTime: times[currentIndex + 1] };
      }
      return prev;
    });
  };

  const handleRest = () => {
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        day: prev.day + 1,
        currentTime: TimeOfDay.Morning,
        reputation: Math.min(100, prev.reputation + 10)
      };
    });
    new Audio(ASSETS.audio.rest).play().catch(() => {});
    setView('map');
  };

  const startCase = async (npc: NPC) => {
    if (gameState?.currentTime === TimeOfDay.Night) return;
    setActiveNPC(npc);
    setView('loading');
    
    const grade = gameState!.grade;
    const currentLocation = gameState!.currentLocation;
    const curriculumForGrade = CURRICULUM[grade] || CURRICULUM[GradeLevel.P1];
    const subjects = Object.keys(curriculumForGrade);
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)] as Subject;
    const points = curriculumForGrade[randomSubject];
    const randomPoint = points[Math.floor(Math.random() * points.length)];

    try {
      const scenario = await generateMagistrateCase(grade, randomSubject, randomPoint, currentLocation);
      setCurrentScenario(scenario);
      setSelectedOption(null);
      setFeedback(null);
      setView('case');
    } catch (error) {
      console.error(error);
      setView('scene');
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const option = currentScenario!.options[index];
    setFeedback(option.feedback);
    
    new Audio(option.isCorrect ? ASSETS.audio.correct : ASSETS.audio.wrong).play().catch(() => {});

    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentScore: option.isCorrect ? prev.currentScore + 20 : prev.currentScore,
        reputation: option.isCorrect ? Math.min(100, prev.reputation + 5) : Math.max(0, prev.reputation - 15),
        casesSolved: prev.casesSolved + 1
      };
    });
  };

  const navigateToLocation = (loc: Location) => {
    setGameState(prev => prev ? { ...prev, currentLocation: loc } : null);
    setView('scene');
  };

  const visibleNPCs = gameState 
    ? NPCS.filter(npc => npc.location === gameState.currentLocation && npc.availableTimes.includes(gameState.currentTime)) 
    : [];

  return (
    <div className="max-w-md mx-auto h-screen relative shadow-2xl overflow-hidden border-x border-gray-300 flex flex-col bg-[#f4ece1]">
      {/* Dynamic Background Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-1000 grayscale select-none"
        style={{ 
          backgroundImage: `url(${gameState ? ASSETS.images.backgrounds[gameState.currentLocation] : ASSETS.images.mainBackground})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      ></div>

      {view === 'start' && <StartView onStart={startNewGame} />}
      
      {view === 'intro' && gameState && (
        <IntroView 
          playerName={gameState.playerName} 
          onComplete={() => setView('map')} 
        />
      )}

      {view === 'map' && gameState && (
        <MapView 
          currentLocation={gameState.currentLocation} 
          onSelectLocation={navigateToLocation} 
        />
      )}

      {gameState && (view === 'scene' || view === 'case' || view === 'loading') && (
        <>
          <GameHeader state={gameState} onOpenMap={() => setView('map')} />
          
          <div className="flex-1 overflow-y-auto z-20 relative flex flex-col">
            {view === 'loading' && (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-calligraphy text-2xl animate-pulse text-gray-800">落笔生花，查阅卷宗...</p>
              </div>
            )}

            {view === 'scene' && (
              <div className="p-4 space-y-6 flex-1 animate-in fade-in duration-500">
                <div className="bg-[#fffbf2]/90 p-5 rounded-xl border-2 border-gray-800 shadow-lg ink-border" style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}>
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
                  {visibleNPCs.map(npc => (
                    <button 
                      key={npc.id}
                      onClick={() => startCase(npc)}
                      className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-300 hover:bg-white/90 hover:shadow-md transition-all active:scale-95 group"
                    >
                      <div className="animate-portrait-idle group-hover:scale-110 transition-transform">
                        <img src={npc.portrait} alt={npc.name} className="w-20 h-20 rounded-lg mb-2 shadow-sm bg-gray-50 p-1" />
                      </div>
                      <span className="font-calligraphy text-lg text-gray-800">{npc.name}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{npc.title}</span>
                    </button>
                  ))}
                </div>

                {visibleNPCs.length === 0 && gameState.currentTime !== TimeOfDay.Night && (
                  <div className="mt-10 text-center opacity-40 grayscale flex flex-col items-center">
                    <div className="text-6xl mb-4">🍂</div>
                    <p className="font-serif italic">此处暂无乡亲寻访，不如去他处巡视。</p>
                  </div>
                )}

                {gameState.currentTime === TimeOfDay.Night && gameState.currentLocation === Location.Office && (
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={handleRest} 
                      className="px-12 py-5 bg-indigo-950 text-white rounded-full font-calligraphy text-3xl shadow-2xl active:translate-y-1 transition-all border-b-4 border-black"
                    >
                      秉烛而睡 · 休息
                    </button>
                  </div>
                )}
              </div>
            )}

            {view === 'case' && currentScenario && activeNPC && (
              <div className="p-4 space-y-4 pb-20 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
                <div className="p-6 bg-white/95 rounded-lg border-2 border-gray-800 ink-border shadow-md" style={{ backgroundImage: `url(${ASSETS.images.paperTexture})` }}>
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-red-900 border-2 border-red-900 px-3 py-1 rounded-full">{currentScenario.subject}</span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-tighter tracking-widest">QY-CASE-{Math.floor(Math.random()*90000)+10000}</span>
                   </div>
                   <div className="flex items-start space-x-4 mb-6">
                      <img src={activeNPC.portrait} alt="NPC" className="w-16 h-16 rounded-xl border-2 border-gray-400 p-0.5 bg-gray-50 shadow-inner" />
                      <div>
                        <span className="font-calligraphy text-gray-600 text-sm">【{activeNPC.name}】</span>
                        <p className="text-gray-800 font-serif leading-relaxed text-lg mt-1 italic">
                          “{currentScenario.description}”
                        </p>
                      </div>
                   </div>

                   <div className="mt-4 p-5 bg-[#f8f5f0] rounded-xl border-l-8 border-gray-800 shadow-inner">
                      {currentScenario.type === 'fill' ? (
                        <div className="font-bold text-gray-900 text-xl leading-relaxed font-serif">
                          {currentScenario.question.split('___').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className={`inline-block min-w-[100px] border-b-4 border-gray-800 mx-2 text-center transition-all ${selectedOption !== null ? 'text-red-900' : 'animate-pulse text-transparent bg-gray-200'}`}>
                                  {selectedOption !== null ? currentScenario.options[selectedOption].text : '？'}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <p className="font-bold text-gray-900 text-xl font-serif leading-snug">{currentScenario.question}</p>
                      )}
                   </div>
                </div>

                <div className={`grid gap-4 ${currentScenario.type === 'boolean' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {currentScenario.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`relative p-5 rounded-2xl border-2 transition-all font-serif group overflow-hidden ${
                        selectedOption === null 
                        ? 'border-gray-300 bg-white/80 hover:border-gray-800 hover:bg-white active:scale-95 shadow-sm' 
                        : idx === selectedOption 
                          ? opt.isCorrect ? 'border-green-600 bg-green-50 shadow-inner' : 'border-red-600 bg-red-50 shadow-inner'
                          : opt.isCorrect ? 'border-green-200 opacity-60' : 'border-gray-200 opacity-30 grayscale'
                      } ${currentScenario.type === 'boolean' ? 'py-10 text-3xl font-calligraphy' : 'text-lg'}`}
                    >
                      <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                      {currentScenario.type === 'boolean' && (
                         <div className={`absolute -top-2 -right-2 opacity-10 text-6xl rotate-12 ${idx === 0 ? 'text-green-800' : 'text-red-800'}`}>
                           {opt.text === '正确' || opt.text.includes('是') ? '是' : '非'}
                         </div>
                      )}
                      <span className="relative z-10">{opt.text}</span>
                    </button>
                  ))}
                </div>

                {selectedOption !== null && (
                  <div className="p-6 rounded-2xl bg-[#fffbf2]/98 border-2 border-gray-400 shadow-2xl animate-in zoom-in duration-300 relative">
                    <div className="absolute top-4 right-6 text-6xl opacity-10 select-none font-calligraphy">
                      {currentScenario.options[selectedOption].isCorrect ? '明' : '偏'}
                    </div>
                    <h4 className={`font-calligraphy text-3xl mb-3 ${currentScenario.options[selectedOption].isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {currentScenario.options[selectedOption].isCorrect ? '『 明察秋毫 』' : '『 查无实据 』'}
                    </h4>
                    <p className="text-gray-700 italic mb-6 font-serif border-l-4 border-gray-200 pl-4">“{feedback}”</p>
                    <div className="bg-white/80 p-4 rounded-xl text-sm border-2 border-dashed border-gray-300 shadow-inner">
                       <p className="font-bold text-gray-500 mb-2 tracking-widest uppercase text-xs">【夫子点评 · {currentScenario.knowledgePoint}】</p>
                       <p className="text-gray-800 leading-relaxed font-serif text-base">{currentScenario.educationalNote}</p>
                    </div>
                    <button 
                      onClick={() => {advanceTime(); setView('scene');}} 
                      className="w-full mt-6 py-5 bg-gray-900 text-white rounded-2xl font-calligraphy text-2xl shadow-xl hover:bg-black active:scale-95 transition-all"
                    >
                      朱批 · 结案
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const StartView: React.FC<{ onStart: (name: string, grade: GradeLevel) => void }> = ({ onStart }) => {
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

const IntroView: React.FC<{ playerName: string; onComplete: () => void }> = ({ playerName, onComplete }) => {
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
      {/* Texture overlay */}
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

      {/* Aesthetic ink marks */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-red-900/10 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-black/5 rounded-full blur-2xl opacity-50"></div>
    </div>
  );
};

const MapView: React.FC<{ currentLocation: Location; onSelectLocation: (loc: Location) => void }> = ({ currentLocation, onSelectLocation }) => {
  // Mocking coordinates for the map layout
  const locations = [
    { name: Location.Office, top: '45%', left: '50%', icon: '🏛️', desc: '处理政务与卷宗' },
    { name: Location.Market, top: '75%', left: '25%', icon: '⚖️', desc: '体察民情与交易' },
    { name: Location.Bank, top: '75%', left: '75%', icon: '💰', desc: '清查账目与金石' },
    { name: Location.Suburbs, top: '25%', left: '20%', icon: '🏔️', desc: '巡视古迹与山川' },
    { name: Location.Farmland, top: '25%', left: '80%', icon: '🌾', desc: '察看农事与节气' },
  ];

  return (
    <div className="flex flex-col h-full z-40 bg-[#f4ece1] relative overflow-hidden">
      <div className="p-6 bg-[#dcd3c1] border-b-2 border-gray-800 text-center shadow-md">
        <h2 className="font-calligraphy text-4xl text-gray-900 tracking-widest">青云县全舆图</h2>
        <p className="text-gray-500 font-serif text-xs mt-1 italic">点击地名，即可走马上任巡视</p>
      </div>
      
      <div className="flex-1 relative bg-[#e6dfd1] m-4 rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden ink-border" style={{ backgroundImage: `url(${ASSETS.images.mainBackground})`, backgroundSize: 'cover' }}>
        {/* Aesthetic ink clouds */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl cloud-anim"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-black/5 rounded-full blur-3xl cloud-anim" style={{ animationDelay: '-5s' }}></div>

        {locations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => onSelectLocation(loc.name)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-500 ${currentLocation === loc.name ? 'scale-125 z-20' : 'hover:scale-110'}`}
            style={{ top: loc.top, left: loc.left }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 transition-colors ${currentLocation === loc.name ? 'bg-red-900 border-white text-white rotate-12 shadow-red-900/40' : 'bg-white/80 border-gray-800 text-gray-800 group-hover:bg-gray-800 group-hover:text-white'}`}>
              {loc.icon}
            </div>
            <div className={`mt-2 px-4 py-1 rounded-full border-2 border-gray-800 font-calligraphy text-xl transition-colors ${currentLocation === loc.name ? 'bg-red-900 text-white shadow-md' : 'bg-white/90 text-gray-800 group-hover:bg-gray-800 group-hover:text-white'}`}>
              {loc.name}
            </div>
            {currentLocation === loc.name && (
              <div className="mt-1 text-[10px] text-red-900 font-serif font-bold uppercase tracking-tighter animate-pulse">
                所在地
              </div>
            )}
            <div className="absolute -bottom-12 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/80 text-white text-[10px] p-1 rounded-md">
              {loc.desc}
            </div>
          </button>
        ))}

        {/* Decorative Compass */}
        <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-gray-800 rounded-full flex items-center justify-center opacity-40">
           <span className="text-[10px] font-serif font-bold rotate-0 absolute top-0">北</span>
           <span className="text-[10px] font-serif font-bold rotate-180 absolute bottom-0">南</span>
        </div>
      </div>

      <div className="p-4 text-center opacity-60 font-serif text-[10px]">
        ※ 青云县地杰人灵，大人请勤于巡视，广积民望 ※
      </div>
    </div>
  );
};
