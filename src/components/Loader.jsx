import { motion } from 'framer-motion';

export default function Loader({ progress }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0d001a] via-[#1a0033] to-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-64 sm:w-80 h-1 bg-white/20 mb-4 overflow-hidden rounded-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#00ffff] shadow-[0_0_10px_#00ffff]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        <p className="font-mono text-xs sm:text-sm tracking-widest opacity-60 text-[#00ffff]">INITIALIZING CYNET PROTOCOL...</p>
        <p className="font-display text-4xl sm:text-5xl mt-4 tracking-tighter text-white">
          {Math.round(progress)}%
        </p>
      </motion.div>
    </div>
  );
}
