import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';
import CharacterPicker from './components/CharacterPicker';
import MazeCanvas from './components/MazeCanvas';
import GlitchText from './components/GlitchText';
import GameUI from './components/GameUI';
import MiniMap from './components/MiniMap';
import Confetti from './components/Confetti';
import { soundManager } from './audio/soundManager';

function App() {
  const [gameState, setGameState] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [character, setCharacter] = useState('robot');
  const [theme, setTheme] = useState('black');
  const [gameStats, setGameStats] = useState({
    startTime: null,
    elapsedTime: 0,
    score: 0,
    moves: 0,
    collectibles: 0,
    totalCollectibles: 0
  });

  // Simulate Loading - starts at 0 and goes up to 100
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setGameState('selection'), 300);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Game Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        elapsedTime: (Date.now() - prev.startTime) / 1000
      }));
    }, 100);
    
    return () => clearInterval(timer);
  }, [gameState]);

  const handleCharacterSelect = (char) => {
    setCharacter(char);
    soundManager.init(); // Initialize audio context on user interaction
    setGameState('playing');
    setGameStats(prev => ({ ...prev, startTime: Date.now() }));
  };

  const handleReachCore = () => {
    if (gameState !== 'victory') {
      soundManager.playExplosion();
      soundManager.playVictory();
      setGameState('victory');
      // Calculate final score
      const timeBonus = Math.max(0, 10000 - Math.floor(gameStats.elapsedTime) * 10);
      const collectibleBonus = gameStats.collectibles * 1000;
      const moveBonus = Math.max(0, 5000 - gameStats.moves * 10);
      setGameStats(prev => ({
        ...prev,
        score: prev.score + timeBonus + collectibleBonus + moveBonus
      }));
    }
  };

  const handleMove = () => {
    setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
  };

  const handleCollectible = () => {
    setGameStats(prev => ({
      ...prev,
      collectibles: prev.collectibles + 1,
      score: prev.score + 500
    }));
    soundManager.playCollectible();
  };

  const handleSetTotalCollectibles = (count) => {
    setGameStats(prev => ({ ...prev, totalCollectibles: count }));
  };

  return (
    <main className="w-full h-screen overflow-hidden relative selection:bg-white selection:text-black">
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: theme === 'black' 
            ? 'radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 50%, #050505 100%)'
            : 'radial-gradient(circle at 50% 50%, #1a0033 0%, #0d001a 50%, #000000 100%)'
        }}
      />
      
      {/* Animated Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            ${theme === 'black' ? '#ffffff' : '#00ffff'} 0px,
            transparent 1px,
            transparent 2px,
            ${theme === 'black' ? '#ffffff' : '#00ffff'} 3px
          ),
          repeating-linear-gradient(
            90deg,
            ${theme === 'black' ? '#ffffff' : '#ff00ff'} 0px,
            transparent 1px,
            transparent 2px,
            ${theme === 'black' ? '#ffffff' : '#ff00ff'} 3px
          )`,
          backgroundSize: '50px 50px',
          opacity: theme === 'black' ? 0.05 : 0.15
        }}
      />
      
      <AnimatePresence mode="wait">
        
        {/* LOADING STATE */}
        {gameState === 'loading' && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50"
          >
            <Loader progress={progress} />
          </motion.div>
        )}

        {/* SELECTION STATE */}
        {gameState === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
          >
            <CharacterPicker onSelect={handleCharacterSelect} />
            {/* Background noise/video could go here */}
          </motion.div>
        )}

        {/* PLAYING STATE */}
        {(gameState === 'playing' || gameState === 'victory') && (
           <motion.div
             key="game"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-0"
           >
             <MazeCanvas 
               character={character} 
               onReachCore={handleReachCore} 
               theme={theme}
               onMove={handleMove}
               onCollectible={handleCollectible}
               onSetTotalCollectibles={handleSetTotalCollectibles}
               gameStats={gameStats}
             />
             
             {/* Game UI */}
             {gameState === 'playing' && (
               <GameUI 
                 elapsedTime={gameStats.elapsedTime}
                 score={gameStats.score}
                 collectibles={gameStats.collectibles}
                 totalCollectibles={gameStats.totalCollectibles}
                 moves={gameStats.moves}
                 theme={theme}
               />
             )}
             
             {/* Theme Toggle Button */}
             <motion.button
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setTheme(theme === 'black' ? 'white' : 'black')}
               className="absolute top-4 sm:top-8 right-4 sm:right-8 z-10 px-4 sm:px-6 py-2 sm:py-3 border font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_transparent] hover:shadow-[0_0_15px_currentColor]"
               style={{
                 borderColor: theme === 'black' ? '#ffffff' : '#00ffff',
                 color: theme === 'black' ? '#ffffff' : '#00ffff',
                 backgroundColor: 'transparent'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = theme === 'black' ? '#ffffff' : '#00ffff';
                 e.currentTarget.style.color = theme === 'black' ? '#000000' : '#000000';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'transparent';
                 e.currentTarget.style.color = theme === 'black' ? '#ffffff' : '#00ffff';
               }}
             >
               {theme === 'black' ? '◐ Neon' : '◑ Black'}
             </motion.button>
           </motion.div>
        )}

        {/* VICTORY OVERLAY */}
        {gameState === 'victory' && (
          <motion.div
            key="victory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto cursor-default"
            style={{ backgroundColor: theme === 'black' ? 'rgba(0,0,0,0.95)' : 'rgba(10,0,20,0.95)' }}
          >
            <Confetti theme={theme} />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <GlitchText text="CYNET – COMING SOON 2026" theme={theme} />
            </motion.div>
            
            {/* Stats Display */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 font-mono text-xs sm:text-sm px-4"
              style={{ color: theme === 'black' ? '#ffffff' : '#00ffff' }}
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-2">{Math.floor(gameStats.elapsedTime)}s</div>
                <div className="opacity-60 uppercase tracking-wider">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-2">{gameStats.score.toLocaleString()}</div>
                <div className="opacity-60 uppercase tracking-wider">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-2">{gameStats.moves}</div>
                <div className="opacity-60 uppercase tracking-wider">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-2">{gameStats.collectibles}/{gameStats.totalCollectibles}</div>
                <div className="opacity-60 uppercase tracking-wider">Items</div>
              </div>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="mt-8 sm:mt-12 px-6 sm:px-8 py-2.5 sm:py-3 border transition-all duration-300 font-mono tracking-widest text-xs sm:text-sm uppercase shadow-[0_0_15px_transparent] hover:shadow-[0_0_15px_currentColor]"
              style={{
                borderColor: theme === 'black' ? '#ffffff' : '#00ffff',
                color: theme === 'black' ? '#ffffff' : '#00ffff',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'black' ? '#ffffff' : '#00ffff';
                e.currentTarget.style.color = theme === 'black' ? '#000000' : '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme === 'black' ? '#ffffff' : '#00ffff';
              }}
            >
              Reboot System
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default App;
