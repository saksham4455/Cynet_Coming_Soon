import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

export default function CountdownTimer({ targetDate, theme }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const textColor = theme === 'black' ? '#ffffff' : '#00ffff';
  const accentColor = theme === 'black' ? '#ffff00' : '#ff00ff';
  const bgColor = theme === 'black' ? 'rgba(0,0,0,0.5)' : 'rgba(10,0,30,0.5)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 font-mono px-4"
    >
      {/* Coming Soon Banner */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 2,
          ease: "easeInOut" 
        }}
        className="flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 border-2 backdrop-blur-md"
        style={{ 
          borderColor: accentColor,
          backgroundColor: bgColor,
          color: textColor 
        }}
      >
        <Calendar size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: accentColor }} />
        <span className="text-sm sm:text-lg md:text-xl lg:text-2xl tracking-wider font-bold">
          CYNET COMING SOON
        </span>
        <Calendar size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: accentColor }} />
      </motion.div>

      {/* Launch Date */}
      <div className="text-center">
        <div 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider mb-2"
          style={{ 
            color: accentColor,
            textShadow: `0 0 20px ${accentColor}` 
          }}
        >
          14th MARCH 2026
        </div>
        <div className="text-[10px] sm:text-xs md:text-sm opacity-70" style={{ color: textColor }}>
          OFFICIAL LAUNCH DATE
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-1 sm:mt-2 md:mt-4">
        {[
          { value: timeLeft.days, label: 'DAYS' },
          { value: timeLeft.hours, label: 'HOURS' },
          { value: timeLeft.minutes, label: 'MINS' },
          { value: timeLeft.seconds, label: 'SECS' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, ease: "easeOut" }}
            className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px]"
          >
            <div 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold border-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 backdrop-blur-md min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[80px] text-center"
              style={{ 
                borderColor: theme === 'black' ? '#ffffff' : '#00ffff',
                backgroundColor: bgColor,
                color: textColor,
                textShadow: `0 0 10px ${textColor}`
              }}
            >
              {String(item.value).padStart(2, '0')}
            </div>
            <div 
              className="text-[9px] sm:text-xs md:text-sm tracking-widest opacity-70"
              style={{ color: textColor }}
            >
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Clock Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="mt-1 sm:mt-2 md:mt-4"
      >
        <Clock size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" style={{ color: accentColor }} />
      </motion.div>
    </motion.div>
  );
}
