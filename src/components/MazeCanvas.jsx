import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Vector3, Quaternion, Matrix4, Color } from 'three';
import { OrbitControls, PerspectiveCamera, Environment, Trail, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { generateMaze } from '../three/mazeGenerator';
import { useControls } from '../hooks/useControls';
import { soundManager } from '../audio/soundManager';
import MiniMap from './MiniMap';
import ParticleExplosion from './ParticleExplosion';
import gsap from 'gsap';

// --- Maze Geometry ---
function MazeMap({ maze, theme }) {
  const meshRef = useRef(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    const tempObject = new THREE.Object3D();
    let index = 0;
    
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        if (maze.grid[y][x] === 'wall') {
          tempObject.position.set(x, 0.5, y);
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(index++, tempObject.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [maze]);

  const wallCount = maze.grid.flat().filter(cell => cell === 'wall').length;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, wallCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={theme === 'black' ? '#111' : '#1a0033'}
        emissive={theme === 'black' ? '#000000' : '#330066'}
        emissiveIntensity={theme === 'black' ? 0 : 0.3}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color={theme === 'black' ? '#333' : '#00ffff'} />
      </lineSegments>
    </instancedMesh>
  );
}

// --- Player Character ---
function Player({ 
  maze, 
  character, 
  onReachCore,
  theme,
  onMove,
  onCollectible,
  collectibles,
  onPlayerMove
}) {
  const direction = useControls();
  const [gridPos, setGridPos] = useState({ x: maze.start[0], y: maze.start[1] });
  const [targetPos, setTargetPos] = useState({ x: maze.start[0], y: maze.start[1] });
  const groupRef = useRef(null);
  const { camera } = useThree();
  const moveCooldownRef = useRef(0);
  const MOVE_COOLDOWN = 0.15; // Seconds between moves for smooth continuous movement
  
  // Smooth continuous movement with cooldown
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Update cooldown
    if (moveCooldownRef.current > 0) {
      moveCooldownRef.current -= delta;
    }

    // Check for movement when cooldown is ready
    if (direction && moveCooldownRef.current <= 0) {
      const { x, y } = gridPos;
      let nextX = x;
      let nextY = y;

      if (direction === 'up') nextY -= 1;
      if (direction === 'down') nextY += 1;
      if (direction === 'left') nextX -= 1;
      if (direction === 'right') nextX += 1;

      // Check bounds and collision
      if (
        nextX >= 0 && nextX < maze.width &&
        nextY >= 0 && nextY < maze.height &&
        maze.grid[nextY][nextX] !== 'wall'
      ) {
        setGridPos({ x: nextX, y: nextY });
        setTargetPos({ x: nextX, y: nextY });
        soundManager.playMove();
        moveCooldownRef.current = MOVE_COOLDOWN;
        onMove();
        onPlayerMove({ x: nextX, y: nextY });

        // Check collectible
        if (collectibles.some(c => c.x === nextX && c.y === nextY && !c.collected)) {
          onCollectible(nextX, nextY);
        }

        // Check win condition
        if (maze.grid[nextY][nextX] === 'core') {
          onReachCore();
        }
      }
    }

    // Smooth lerp to target position
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos.x, 10 * delta);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos.y, 10 * delta);

    // Camera follow with offset
    const camOffset = new Vector3(0, 10, 5); // Isometric-ish view
    const targetCamPos = new Vector3(
      groupRef.current.position.x + camOffset.x,
      groupRef.current.position.y + camOffset.y,
      groupRef.current.position.z + camOffset.z
    );
    
    camera.position.lerp(targetCamPos, 5 * delta);
    camera.lookAt(groupRef.current.position);
    
    // Character rotation based on movement
    if (direction) {
       let targetRot = 0;
       if (direction === 'up') targetRot = Math.PI;
       if (direction === 'down') targetRot = 0;
       if (direction === 'left') targetRot = -Math.PI / 2;
       if (direction === 'right') targetRot = Math.PI / 2;
       
       // Simple rotation snap for now, could be lerped too
       groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 10 * delta);
    }
  });

  return (
    <group ref={groupRef} position={[maze.start[0], 0.5, maze.start[1]]}>
      <Trail width={0.2} length={4} color={theme === 'black' ? '#FFF' : '#00ffff'} attenuation={(t) => t * t}>
        {character === 'robot' ? (
           <Float speed={4} rotationIntensity={0.2} floatIntensity={0.3}>
             <group>
               <mesh position={[0, 0, 0]}>
                 <boxGeometry args={[0.4, 0.4, 0.4]} />
                 <meshStandardMaterial 
                   color={theme === 'black' ? 'white' : '#00ffff'}
                   emissive={theme === 'black' ? '#000000' : '#00ffff'}
                   emissiveIntensity={theme === 'black' ? 0 : 0.5}
                   metalness={0.3}
                   roughness={0.7}
                 />
               </mesh>
               <mesh position={[0, 0.35, 0]}>
                 <sphereGeometry args={[0.15]} />
                 <meshStandardMaterial 
                   color={theme === 'black' ? 'white' : '#ff00ff'}
                   roughness={0.2} 
                   metalness={0.8}
                   emissive={theme === 'black' ? 'white' : '#ff00ff'}
                   emissiveIntensity={theme === 'black' ? 0.2 : 0.6}
                 />
               </mesh>
               {/* Antenna */}
               <mesh position={[0, 0.5, 0]}>
                 <cylinderGeometry args={[0.02, 0.02, 0.15]} />
                 <meshStandardMaterial color={theme === 'black' ? '#888' : '#444'} />
               </mesh>
               <mesh position={[0, 0.58, 0]}>
                 <sphereGeometry args={[0.04]} />
                 <meshStandardMaterial 
                   color="#ff0000" 
                   emissive="#ff0000"
                   emissiveIntensity={0.8}
                 />
               </mesh>
             </group>
           </Float>
        ) : (
           <Float speed={4} rotationIntensity={0.2} floatIntensity={0.3}>
             <group>
               <mesh position={[0, -0.1, 0]}>
                 <boxGeometry args={[0.3, 0.2, 0.6]} />
                 <meshStandardMaterial 
                   color={theme === 'black' ? 'white' : '#00ffff'}
                   emissive={theme === 'black' ? '#000000' : '#00ffff'}
                   emissiveIntensity={theme === 'black' ? 0 : 0.4}
                   metalness={0.5}
                   roughness={0.5}
                 />
               </mesh>
               {/* Wheels (Rotated Cylinders) */}
               <mesh position={[0.2, -0.2, 0.2]} rotation={[0, 0, Math.PI / 2]}>
                 <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                 <meshStandardMaterial color={theme === 'black' ? '#555' : '#aaa'} />
               </mesh>
               <mesh position={[-0.2, -0.2, 0.2]} rotation={[0, 0, Math.PI / 2]}>
                 <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                 <meshStandardMaterial color={theme === 'black' ? '#555' : '#aaa'} />
               </mesh>
               <mesh position={[0.2, -0.2, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                 <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                 <meshStandardMaterial color={theme === 'black' ? '#555' : '#aaa'} />
               </mesh>
               <mesh position={[-0.2, -0.2, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                 <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                 <meshStandardMaterial color={theme === 'black' ? '#555' : '#aaa'} />
               </mesh>
               {/* Headlights */}
               <mesh position={[0.1, -0.05, 0.3]}>
                 <sphereGeometry args={[0.04]} />
                 <meshStandardMaterial 
                   color="#ffff00"
                   emissive="#ffff00"
                   emissiveIntensity={0.8}
                 />
               </mesh>
               <mesh position={[-0.1, -0.05, 0.3]}>
                 <sphereGeometry args={[0.04]} />
                 <meshStandardMaterial 
                   color="#ffff00"
                   emissive="#ffff00"
                   emissiveIntensity={0.8}
                 />
               </mesh>
             </group>
           </Float>
        )}
      </Trail>
      <pointLight distance={3} intensity={5} color={theme === 'black' ? 'white' : '#00ffff'} />
      {/* Rim light for better depth */}
      <pointLight 
        position={[0, 1, -1]} 
        distance={2} 
        intensity={2} 
        color={theme === 'black' ? '#4444ff' : '#ff00ff'} 
      />
    </group>
  );
}

// --- Core Goal ---
function Core({ position, theme }) {
  const meshRef = useRef(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime();
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group position={[position[0], 0.5, position[1]]}>
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshBasicMaterial color={theme === 'black' ? 'white' : '#ff00ff'} wireframe />
        </mesh>
      </Float>
      <Sparkles count={50} scale={3} size={2} speed={0.4} opacity={0.5} color={theme === 'black' ? 'white' : '#ff00ff'} />
      <pointLight distance={5} intensity={10} color={theme === 'black' ? 'white' : '#ff00ff'} />
    </group>
  );
}

// --- Collectible Item ---
function Collectible({ position, theme, collected }) {
  const meshRef = useRef(null);
  
  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 2;
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
    }
  });

  if (collected) return null;

  return (
    <group position={[position.x, 0.5, position.y]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial 
            color={theme === 'black' ? '#ffff00' : '#ff00ff'} 
            emissive={theme === 'black' ? '#ffff00' : '#ff00ff'}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
      <pointLight distance={2} intensity={2} color={theme === 'black' ? '#ffff00' : '#ff00ff'} />
    </group>
  );
}

// --- Main Canvas Component ---
export default function MazeCanvas({ 
  character, 
  onReachCore,
  theme = 'black',
  onMove,
  onCollectible,
  onSetTotalCollectibles,
  gameStats
}) {
  const [maze] = useState(() => generateMaze(11, 11)); // Generate new random maze each time
  const [playerPos, setPlayerPos] = useState({ x: maze.start[0], y: maze.start[1] });
  const [collectibles, setCollectibles] = useState(() => {
    // Generate collectibles in random path positions
    const items = [];
    const pathCells = [];
    
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        if (maze.grid[y][x] === 'path' && 
            !(x === maze.start[0] && y === maze.start[1]) &&
            !(x === maze.end[0] && y === maze.end[1])) {
          pathCells.push({ x, y });
        }
      }
    }
    
    // Place 5-8 collectibles randomly
    const numCollectibles = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numCollectibles && pathCells.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pathCells.length);
      const cell = pathCells.splice(randomIndex, 1)[0];
      items.push({ ...cell, collected: false });
    }
    
    return items;
  });

  useEffect(() => {
    onSetTotalCollectibles(collectibles.length);
  }, []);

  const handleCollectible = (x, y) => {
    setCollectibles(prev => 
      prev.map(c => 
        c.x === x && c.y === y ? { ...c, collected: true } : c
      )
    );
    onCollectible();
  };

  const handlePlayerMove = (pos) => {
    setPlayerPos(pos);
  };

  return (
    <div className="w-full h-screen relative" style={{ backgroundColor: theme === 'black' ? '#000000' : '#0a0014' }}>
      {/* ENIGMA Logo on Left Side */}
      <div className="absolute left-4 sm:left-8 top-4 sm:top-8 z-20 pointer-events-none">
        <img 
          src="/Enigma_Logo.svg" 
          alt="ENIGMA" 
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
          style={{ 
            opacity: 0.8
          }}
        />
      </div>

      {/* Minimap */}
      <MiniMap maze={maze} playerPos={playerPos} theme={theme} />
      
      <Canvas shadows dpr={[1, 1.5]} performance={{ min: 0.5 }} frameloop="demand">
        <PerspectiveCamera makeDefault position={[0, 10, 5]} fov={50} />
        
        <color attach="background" args={[theme === 'black' ? '#050505' : '#0a0014']} />
        
        <Environment preset="city" />
        
        <ambientLight intensity={theme === 'black' ? 0.1 : 0.3} />
        
        {/* Dynamic Background Lighting */}
        <pointLight position={[10, 5, 10]} intensity={2} color={theme === 'black' ? '#ffffff' : '#00ffff'} />
        <spotLight 
          position={[-10, 15, -10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3} 
          castShadow 
          color={theme === 'black' ? '#ffffff' : '#ff00ff'}
        />
        <rectAreaLight
          width={20}
          height={20}
          intensity={1.5}
          position={[10, 10, 10]}
          rotation={[-Math.PI / 2, 0, 0]}
          color={theme === 'black' ? '#ffffff' : '#00ff00'}
        />
        
        {/* Floor */}
        <gridHelper args={[50, 50, theme === 'black' ? 0x333333 : 0x00ffff, theme === 'black' ? 0x111111 : 0x330066]} position={[5, 0, 5]} />
        
        <MazeMap maze={maze} theme={theme} />
        <Player 
          maze={maze} 
          character={character} 
          onReachCore={onReachCore} 
          theme={theme}
          onMove={onMove}
          onCollectible={handleCollectible}
          collectibles={collectibles}
          onPlayerMove={handlePlayerMove}
        />
        <Core position={maze.end} theme={theme} />
        
        {/* Render Collectibles */}
        {collectibles.map((item, i) => (
          <Collectible 
            key={i} 
            position={item} 
            theme={theme}
            collected={item.collected}
          />
        ))}
        
        <Sparkles count={100} scale={[20, 10, 20]} size={1} speed={0.2} opacity={0.15} color={theme === 'black' ? 'white' : '#00ffff'} />
        
        <fog attach="fog" args={[theme === 'black' ? '#050505' : '#0a0014', 8, 25]} />
        
        {/* Post-processing Effects */}
        <EffectComposer multisampling={0}>
          <Bloom 
            intensity={0.3} 
            luminanceThreshold={0.3} 
            luminanceSmoothing={0.7}
            mipmapBlur
          />
          <Vignette 
            offset={0.3} 
            darkness={0.5} 
            eskil={false} 
            blendFunction={BlendFunction.NORMAL}
          />
          <ChromaticAberration 
            offset={[0.001, 0.001]}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Mobile Controls Overlay Hint */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center pointer-events-none z-10">
        <p className="font-mono text-xs sm:text-sm" style={{ color: theme === 'black' ? 'rgba(255,255,255,0.3)' : 'rgba(0,255,255,0.5)' }}>
          <span className="hidden sm:inline">USE ARROWS / WASD TO MOVE</span>
          <span className="sm:hidden">SWIPE TO MOVE</span>
        </p>
      </div>
    </div>
  );
}
