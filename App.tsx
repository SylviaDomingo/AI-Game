
import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel, Subject, Scenario, GameState, Location, TimeOfDay, NPC } from './types';
import { CURRICULUM } from './data/curriculum';
import { generateMagistrateCase, generateSpeech, playAudio, speakPhrase, generateAmbientMusic } from './services/ai';
import { ASSETS } from './constants/assets';
import { NPCS } from './data/npcs';

// Import View Components
import { GameHeader } from './components/GameHeader';
import { StartView } from './components/StartView';
import { IntroView } from './components/IntroView';
import { MapView } from './components/MapView';
import { LoadingView } from './components/LoadingView';
import { SceneView } from './components/SceneView';
import { CaseView } from './components/CaseView';
import { MysteryDialogueView } from './components/MysteryDialogueView';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [view, setView] = useState<'start' | 'intro' | 'map' | 'loading' | 'scene' | 'case'>('start');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [successAudioData, setSuccessAudioData] = useState<string | null>(null);
  
  // 背景音乐相关状态
  const [isMuted, setIsMuted] = useState(false);
  const bgmSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // 游戏初始加载时生成背景音乐
  useEffect(() => {
    const initBGM = async () => {
      const musicData = await generateAmbientMusic();
      if (musicData) {
        const source = await playAudio(musicData, true); // true 表示循环播放
        bgmSourceRef.current = source;
      }
    };
    initBGM();
    
    return () => {
      if (bgmSourceRef.current) {
        bgmSourceRef.current.stop();
      }
    };
  }, []);

  const toggleMute = () => {
    if (bgmSourceRef.current) {
      const ctx = bgmSourceRef.current.context as any;
      if (!isMuted) {
        if (ctx.suspend) ctx.suspend();
      } else {
        if (ctx.resume) ctx.resume();
      }
    }
    setIsMuted(!isMuted);
  };

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
      // 同时生成案件内容、开场白、以及后续的成功感谢语
      const scenarioPromise = generateMagistrateCase(grade, randomSubject, randomPoint, currentLocation);
      const introSpeechPromise = generateSpeech("稍显急切", "大人，帮帮我！");
      const successSpeechPromise = generateSpeech("稍显感激", "谢大人明察！");

      const [scenario, introAudio, successAudio] = await Promise.all([
        scenarioPromise, 
        introSpeechPromise,
        successSpeechPromise
      ]);
      
      setCurrentScenario(scenario);
      setSuccessAudioData(successAudio);
      setSelectedOption(null);
      setFeedback(null);
      
      setView('case');
      if (introAudio) {
        playAudio(introAudio);
      }
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

  const getGlobalBg = () => {
    if (!gameState) return ASSETS.images.mainBackground;
    return (ASSETS.images.backgrounds as any)[gameState.currentLocation] || ASSETS.images.mainBackground;
  };

  return (
    <div className="max-w-md mx-auto h-screen relative shadow-2xl overflow-hidden border-x border-gray-300 flex flex-col bg-[#f4ece1]">
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none select-none z-0"
        style={{ 
          backgroundImage: `url(${getGlobalBg()})`, 
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
          <GameHeader 
            state={gameState} 
            isMuted={isMuted} 
            onToggleMute={toggleMute} 
          />
          <div className="flex-1 overflow-y-auto z-20 relative flex flex-col pb-6">
            {view === 'loading' && <LoadingView />}

            {view === 'scene' && (
                <SceneView 
                  gameState={gameState} 
                  npcs={visibleNPCs} 
                  onBackToMap={() => setView('map')} 
                  onStartCase={startCase}
                  onRest={handleRest}
                />
            )}

            {view === 'case' && currentScenario && activeNPC && (
              currentScenario.type === 'mystery' ? (
                  <MysteryDialogueView 
                    currentScenario={currentScenario}
                    activeNPC={activeNPC}
                    successAudioData={successAudioData}
                    onSelectCorrect={handleOptionSelect}
                    onCloseCase={() => { advanceTime(); setView('scene'); }}
                  />
                ) : (
                    <CaseView 
                      currentScenario={currentScenario}
                      activeNPC={activeNPC}
                      successAudioData={successAudioData}
                      selectedOption={selectedOption}
                      feedback={feedback}
                      onSelectOption={handleOptionSelect}
                      onCloseCase={() => { advanceTime(); setView('scene'); }}
                    />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
