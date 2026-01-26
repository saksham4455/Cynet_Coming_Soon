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
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="absolute top-16 sm:top-32 left-4 sm:left-8 z-20 flex flex-col gap-2 sm:gap-3 font-mono text-xs sm:text-sm will-change-transform"
      style={{ color: textColor }}
    >
      {/* Timer */}
      <motion.div 
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border backdrop-blur-md transition-all duration-300 transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Timer size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="tracking-wider">{formatTime(elapsedTime)}</span>
      </motion.div>

      {/* Score */}
      <motion.div 
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border backdrop-blur-md transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Trophy size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="tracking-wider">{score.toLocaleString()}</span>
      </motion.div>

      {/* Collectibles with Progress Bar */}
      <motion.div 
        className="flex flex-col gap-2 px-3 sm:px-4 py-2 border backdrop-blur-md min-w-[130px] sm:min-w-[150px] transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
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
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 border backdrop-blur-md transform-gpu"
        style={{ backgroundColor: bgColor, borderColor }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Target size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="tracking-wider">{moves} MOVES</span>
      </motion.div>
    </motion.div>
  );
}
