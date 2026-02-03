import { motion } from 'framer-motion';
import { Bot, Car, Sparkles, Zap } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function RobotPreview() {
  const groupRef = useRef(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial color="white" roughness={0.2} />
        </mesh>
        <pointLight distance={3} intensity={5} color="white" />
      </Float>
    </group>
  );
}

function CarPreview() {
  const groupRef = useRef(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.6]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.2, -0.2, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#555" />
        </mesh>
        <mesh position={[-0.2, -0.2, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#555" />
        </mesh>
        <mesh position={[0.2, -0.2, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#555" />
        </mesh>
        <mesh position={[-0.2, -0.2, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#555" />
        </mesh>
        <pointLight distance={3} intensity={5} color="white" />
      </Float>
    </group>
  );
}

export default function CharacterPicker({ onSelect }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-br from-[#0d001a] via-[#1a0033] to-black backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-col items-center mb-8 sm:mb-12 md:mb-16"
      >
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] via-[#ff00ff] to-[#00ffff] mb-3 sm:mb-4 tracking-wider text-center drop-shadow-[0_0_15px_#00ffff]">
          GET READY TO ENTER THE CYNET WORLD
        </h1>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-xl sm:text-2xl md:text-3xl text-[#00ffff] tracking-wider flex items-center gap-2 sm:gap-3 drop-shadow-[0_0_10px_#00ffff]"
        >
          <Sparkles size={20} className="sm:w-6 sm:h-6 animate-pulse text-[#ff00ff]" />
          SELECT YOUR AVATAR
          <Sparkles size={20} className="sm:w-6 sm:h-6 animate-pulse text-[#ff00ff]" />
        </motion.h2>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-16 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="relative flex-1"
        >
          <button
            onClick={() => onSelect('robot')}
            className="w-full h-56 sm:h-64 border-2 border-[#00ffff] flex flex-col items-center justify-between p-4 sm:p-6 text-white hover:bg-[#00ffff]/10 hover:shadow-[0_0_20px_#00ffff] transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="w-full h-24 sm:h-32 relative">
              <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[2, 2, 2]} intensity={1} />
                <RobotPreview />
              </Canvas>
            </div>
            
            <div className="flex flex-col items-center gap-1 sm:gap-2 z-10">
              <Bot size={28} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
              <span className="font-mono text-base sm:text-lg tracking-widest font-bold">UNIT-01</span>
              <p className="text-xs opacity-60 text-center">Advanced AI Scout</p>
            </div>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          className="relative flex-1"
        >
          <button
            onClick={() => onSelect('car')}
            className="w-full h-56 sm:h-64 border-2 border-[#ff00ff] flex flex-col items-center justify-between p-4 sm:p-6 text-white hover:bg-[#ff00ff]/10 hover:shadow-[0_0_20px_#ff00ff] transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="w-full h-24 sm:h-32 relative">
              <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[2, 2, 2]} intensity={1} />
                <CarPreview />
              </Canvas>
            </div>
            
            <div className="flex flex-col items-center gap-1 sm:gap-2 z-10">
              <Car size={28} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
              <span className="font-mono text-base sm:text-lg tracking-widest font-bold">MK-II</span>
              <p className="text-xs opacity-60 text-center">Speed Reconnaissance</p>
            </div>
          </button>
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 sm:mt-12 text-[#00ffff]/60 font-mono text-xs tracking-wider uppercase text-center"
      >
        <Zap size={14} className="inline mr-2 text-[#ff00ff]" />
        Choose wisely - Each avatar has unique characteristics
      </motion.p>
    </div>
  );
}
