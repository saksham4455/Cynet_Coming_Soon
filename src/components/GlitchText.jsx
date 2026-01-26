import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlitchText({ text = "CYNET – COMING SOON 2026", theme = 'black' }) {
  const mainColor = theme === 'black' ? '#ffffff' : '#00ffff';
  const glitch1Color = theme === 'black' ? '#ff0055' : '#ff00ff';
  const glitch2Color = theme === 'black' ? '#0055ff' : '#00ff00';

  return (
    <div className="relative text-center px-4">
      <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter relative z-10 animate-glitch"
          style={{ color: mainColor }}>
        {text}
      </h1>
      <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter absolute top-0 left-0 right-0 -z-10 translate-x-[2px] opacity-70 animate-pulse"
          style={{ color: glitch1Color }}>
        {text}
      </h1>
      <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter absolute top-0 left-0 right-0 -z-10 -translate-x-[2px] opacity-70 animate-pulse delay-75"
          style={{ color: glitch2Color }}>
        {text}
      </h1>
    </div>
  );
}
