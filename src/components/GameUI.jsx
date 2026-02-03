import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Zap, Trophy, Target } from 'lucide-react';

export default function GameUI({ 
  elapsedTime, 
  score, 
  collectibles,
  totalCollectibles,
  moves,
  theme 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const textColor = theme === 'black' ? '#ffffff' : '#00ffff';
  const bgColor = theme === 'black' ? 'rgba(0,0,0,0.7)' : 'rgba(10,0,30,0.85)';
  const borderColor = theme === 'black' ? '#ffffff' : '#00ffff';
  const progressPercent = totalCollectibles > 0 ? (collectibles / totalCollectibles) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 30, mass: 0.8 }}
      className="absolute top-20 sm:top-28 md:top-36 lg:top-40 left-2 sm:left-4 md:left-6 lg:left-8 z-20 flex flex-col gap-1.5 sm:gap-2 md:gap-3 font-mono text-[10px] sm:text-xs md:text-sm will-change-transform"
      style={{ color: textColor }}
    >
      {/* Timer */}
      <motion.div 
        className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border backdrop-blur-md transition-all duration-300 transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Timer size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        <span className="tracking-wider">{formatTime(elapsedTime)}</span>
      </motion.div>

      {/* Score */}
      <motion.div 
        className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border backdrop-blur-md transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Trophy size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        <span className="tracking-wider">{score.toLocaleString()}</span>
      </motion.div>

      {/* Collectibles with Progress Bar */}
      <motion.div 
        className="flex flex-col gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border backdrop-blur-md min-w-[110px] sm:min-w-[130px] md:min-w-[150px] transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <Zap size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
          <span className="tracking-wider">{collectibles}/{totalCollectibles}</span>
        </div>
        <div className="w-full h-1 bg-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0"
            style={{ 
              backgroundColor: theme === 'black' ? '#ffff00' : '#ff00ff',
              width: `${progressPercent}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Moves */}
      <motion.div 
        className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border backdrop-blur-md transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Target size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        <span className="tracking-wider">{moves} MOVES</span>
      </motion.div>
    </motion.div>
  );
}
