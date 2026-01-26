import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function MiniMap({ maze, playerPos, theme }) {
  const cellSize = 6; // pixels per cell
  const padding = 4;
  const width = maze.width * cellSize + padding * 2;
  const height = maze.height * cellSize + padding * 2;

  const bgColor = theme === 'black' ? 'rgba(0,0,0,0.8)' : 'rgba(10,0,30,0.9)';
  const borderColor = theme === 'black' ? '#ffffff' : '#00ffff';
  const wallColor = theme === 'black' ? '#333' : '#330066';
  const pathColor = theme === 'black' ? '#111' : '#0d001a';
  const playerColor = theme === 'black' ? '#ffffff' : '#00ffff';
  const coreColor = theme === 'black' ? '#888' : '#ff00ff';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-20 p-1.5 sm:p-2 border backdrop-blur-md scale-75 sm:scale-100"
      style={{ 
        backgroundColor: bgColor,
        borderColor,
        width: width + 'px',
        height: height + 'px'
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Draw maze */}
        {maze.grid.map((row, y) => 
          row.map((cell, x) => {
            const isWall = cell === 'wall';
            const isCore = cell === 'core';
            return (
              <rect
                key={`${x}-${y}`}
                x={padding + x * cellSize}
                y={padding + y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isCore ? coreColor : (isWall ? wallColor : pathColor)}
                stroke={borderColor}
                strokeWidth="0.5"
              />
            );
          })
        )}
        
        {/* Draw player */}
        <circle
          cx={padding + playerPos.x * cellSize + cellSize / 2}
          cy={padding + playerPos.y * cellSize + cellSize / 2}
          r={cellSize / 2.5}
          fill={playerColor}
        >
          <animate
            attributeName="r"
            values={`${cellSize / 2.5};${cellSize / 2};${cellSize / 2.5}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      
      <p className="text-[8px] mt-1 text-center opacity-60 uppercase tracking-wider" style={{ color: borderColor }}>
        Minimap
      </p>
    </motion.div>
  );
}
