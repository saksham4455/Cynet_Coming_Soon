import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Confetti({ theme = 'black' }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        rotation: Math.random() * 360,
        color: theme === 'black' 
          ? ['#ffffff', '#ff0055', '#0055ff', '#ffff00'][Math.floor(Math.random() * 4)]
          : ['#000000', '#ff0055', '#0055ff', '#ff00ff'][Math.floor(Math.random() * 4)]
      });
    }
    setParticles(newParticles);
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3"
          style={{
            left: `${particle.x}%`,
            top: '-10px',
            backgroundColor: particle.color,
            rotate: particle.rotation
          }}
          initial={{ y: -50, opacity: 1 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: [particle.rotation, particle.rotation + 720]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'linear',
            repeat: Infinity
          }}
        />
      ))}
    </div>
  );
}
