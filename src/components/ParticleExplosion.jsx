import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleExplosion({ position, theme, onComplete }) {
  const particlesRef = useRef(null);
  const timeRef = useRef(0);
  const velocities = useRef([]);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    velocities.current = [];

    for (let i = 0; i < particleCount; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 2 + Math.random() * 3;

      velocities.current.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      });

      positions[i * 3] = position[0];
      positions[i * 3 + 1] = position[1];
      positions[i * 3 + 2] = position[2];
    }

    particlesRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
  }, [position]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    timeRef.current += delta;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const particleCount = positions.length / 3;

    for (let i = 0; i < particleCount; i++) {
      const vel = velocities.current[i];
      if (vel) {
        positions[i * 3] += vel.x * delta;
        positions[i * 3 + 1] += vel.y * delta - 9.8 * delta * timeRef.current; // Gravity
        positions[i * 3 + 2] += vel.z * delta;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Fade out and cleanup after 2 seconds
    if (timeRef.current > 2 && onComplete) {
      onComplete();
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.1}
        color={theme === 'black' ? '#ffffff' : '#000000'}
        transparent
        opacity={Math.max(0, 1 - timeRef.current / 2)}
        sizeAttenuation
      />
    </points>
  );
}
