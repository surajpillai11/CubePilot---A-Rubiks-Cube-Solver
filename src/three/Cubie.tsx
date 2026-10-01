import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CubeColor, CubeFaceGrid, CUBE_COLORS } from '../types/cube';

interface CubieProps {
  x: number; // -1, 0, 1
  y: number; // -1, 0, 1
  z: number; // -1, 0, 1
  cubeState: CubeFaceGrid;
  isHighlighted?: boolean;
}

const PLASTIC_COLOR = '#111318';

export const Cubie: React.FC<CubieProps> = ({ x, y, z, cubeState, isHighlighted = false }) => {
  // Compute the 6 face colors for this cubie
  const colors = useMemo(() => {
    // 0: +X (R)
    // 1: -X (L)
    // 2: +Y (U)
    // 3: -Y (D)
    // 4: +Z (F)
    // 5: -Z (B)
    const res: Array<string | null> = [null, null, null, null, null, null];

    // Right Face (+X)
    if (x === 1) {
      const idx = (1 - y) * 3 + (1 - z);
      const c = cubeState.R[idx] as CubeColor;
      res[0] = CUBE_COLORS[c]?.hex || '#EF4444';
    }

    // Left Face (-X)
    if (x === -1) {
      const idx = (1 - y) * 3 + (z + 1);
      const c = cubeState.L[idx] as CubeColor;
      res[1] = CUBE_COLORS[c]?.hex || '#F97316';
    }

    // Up Face (+Y)
    if (y === 1) {
      const idx = (z + 1) * 3 + (x + 1);
      const c = cubeState.U[idx] as CubeColor;
      res[2] = CUBE_COLORS[c]?.hex || '#F8FAFC';
    }

    // Down Face (-Y)
    if (y === -1) {
      const idx = (1 - z) * 3 + (x + 1);
      const c = cubeState.D[idx] as CubeColor;
      res[3] = CUBE_COLORS[c]?.hex || '#FACC15';
    }

    // Front Face (+Z)
    if (z === 1) {
      const idx = (1 - y) * 3 + (x + 1);
      const c = cubeState.F[idx] as CubeColor;
      res[4] = CUBE_COLORS[c]?.hex || '#22C55E';
    }

    // Back Face (-Z)
    if (z === -1) {
      const idx = (1 - y) * 3 + (1 - x);
      const c = cubeState.B[idx] as CubeColor;
      res[5] = CUBE_COLORS[c]?.hex || '#3B82F6';
    }

    return res;
  }, [x, y, z, cubeState]);

  // Spacing between cubies
  const spacing = 1.03;
  const size = 0.98;
  const stickerSize = 0.88;
  const stickerDepth = 0.005;

  return (
    <group position={[x * spacing, y * spacing, z * spacing]}>
      {/* Black plastic core body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color={isHighlighted ? '#1e293b' : PLASTIC_COLOR}
          roughness={0.4}
          metalness={0.2}
          emissive={isHighlighted ? '#3b82f6' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.25 : 0}
        />
      </mesh>

      {/* Stickers on outer visible faces */}
      {/* Right (+X) */}
      {colors[0] && (
        <mesh position={[size / 2 + stickerDepth, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[0]}
            roughness={0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Left (-X) */}
      {colors[1] && (
        <mesh position={[-size / 2 - stickerDepth, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[1]}
            roughness={0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Up (+Y) */}
      {colors[2] && (
        <mesh position={[0, size / 2 + stickerDepth, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[2]}
            roughness={0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Down (-Y) */}
      {colors[3] && (
        <mesh position={[0, -size / 2 - stickerDepth, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[3]}
            roughness={0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Front (+Z) */}
      {colors[4] && (
        <mesh position={[0, 0, size / 2 + stickerDepth]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[4]}
            roughness={0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Back (-Z) */}
      {colors[5] && (
        <mesh position={[0, 0, -size / 2 - stickerDepth]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[5]}
            roughness={0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
