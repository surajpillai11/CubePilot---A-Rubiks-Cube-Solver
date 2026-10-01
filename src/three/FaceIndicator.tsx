import React from 'react';
import * as THREE from 'three';
import { FaceKey, StandardMove } from '../types/cube';

interface FaceIndicatorProps {
  currentMove?: StandardMove | null;
}

export const FaceIndicator: React.FC<FaceIndicatorProps> = ({ currentMove }) => {
  if (!currentMove) return null;

  const face = currentMove[0] as FaceKey;
  const isPrime = currentMove.endsWith("'");
  const isDouble = currentMove.endsWith('2');

  // Offset distance from cube center for face indicator (cube radius ~ 1.55)
  const dist = 1.72;

  let pos: [number, number, number] = [0, 0, 0];
  let rot: [number, number, number] = [0, 0, 0];

  switch (face) {
    case 'R':
      pos = [dist, 0, 0];
      rot = [0, Math.PI / 2, 0];
      break;
    case 'L':
      pos = [-dist, 0, 0];
      rot = [0, -Math.PI / 2, 0];
      break;
    case 'U':
      pos = [0, dist, 0];
      rot = [-Math.PI / 2, 0, 0];
      break;
    case 'D':
      pos = [0, -dist, 0];
      rot = [Math.PI / 2, 0, 0];
      break;
    case 'F':
      pos = [0, 0, dist];
      rot = [0, 0, 0];
      break;
    case 'B':
      pos = [0, 0, -dist];
      rot = [0, Math.PI, 0];
      break;
  }

  return (
    <group position={pos} rotation={rot}>
      {/* Outer translucent luminous outline frame */}
      <mesh>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Border Ring */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.1, 3.1, 0.02)]} />
        <lineBasicMaterial color="#38bdf8" linewidth={2} />
      </lineSegments>

      {/* Directional rotation ring */}
      <mesh position={[0, 0, 0.05]}>
        <ringGeometry args={[0.7, 0.85, 32, 1, 0, isDouble ? Math.PI * 1.75 : Math.PI * 1.5]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Direction arrow pointer */}
      <mesh
        position={[
          (isPrime ? -1 : 1) * 0.77,
          0.1,
          0.06,
        ]}
        rotation={[0, 0, isPrime ? Math.PI / 4 : -Math.PI / 4]}
      >
        <coneGeometry args={[0.16, 0.35, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
};
