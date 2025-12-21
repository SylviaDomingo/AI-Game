
import React, { useState } from 'react';
import { GradeLevel, Subject, Scenario, GameState, Location, TimeOfDay, NPC } from './types';
import { CURRICULUM } from './data/curriculum';
import { generateMagistrateCase } from './services/ai';
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
      {/* Background Layer */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none transition-all duration-1000 select-none"
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
          <GameHeader state={gameState} />
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
              <CaseView 
                currentScenario={currentScenario}
                activeNPC={activeNPC}
                selectedOption={selectedOption}
                feedback={feedback}
                onSelectOption={handleOptionSelect}
                onCloseCase={() => { advanceTime(); setView('scene'); }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
