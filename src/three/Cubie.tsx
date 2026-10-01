import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CubeColor, CubeFaceGrid, CUBE_COLORS, FaceKey } from '../types/cube';

interface CubieProps {
  x: number; // -1, 0, 1
  y: number; // -1, 0, 1
  z: number; // -1, 0, 1
  cubeState: CubeFaceGrid;
  isHighlighted?: boolean;
  onStickerClick?: (face: FaceKey, index: number) => void;
}

const PLASTIC_COLOR = '#111318';
const EMPTY_STICKER_COLOR = '#1e2536';

export const Cubie: React.FC<CubieProps> = ({
  x,
  y,
  z,
  cubeState,
  isHighlighted = false,
  onStickerClick,
}) => {
  // Compute the 6 face colors for this cubie
  const colors = useMemo(() => {
    // 0: +X (R)
    // 1: -X (L)
    // 2: +Y (U)
    // 3: -Y (D)
    // 4: +Z (F)
    // 5: -Z (B)
    const res: Array<string | null> = [null, null, null, null, null, null];

    const getColorHex = (c: CubeColor | undefined, fallback: string) => {
      if (!c || c === 'empty') return EMPTY_STICKER_COLOR;
      return CUBE_COLORS[c]?.hex || fallback;
    };

    // Right Face (+X)
    if (x === 1) {
      const idx = (1 - y) * 3 + (1 - z);
      res[0] = getColorHex(cubeState.R[idx], '#EF4444');
    }

    // Left Face (-X)
    if (x === -1) {
      const idx = (1 - y) * 3 + (z + 1);
      res[1] = getColorHex(cubeState.L[idx], '#F97316');
    }

    // Up Face (+Y)
    if (y === 1) {
      const idx = (z + 1) * 3 + (x + 1);
      res[2] = getColorHex(cubeState.U[idx], '#F8FAFC');
    }

    // Down Face (-Y)
    if (y === -1) {
      const idx = (1 - z) * 3 + (x + 1);
      res[3] = getColorHex(cubeState.D[idx], '#FACC15');
    }

    // Front Face (+Z)
    if (z === 1) {
      const idx = (1 - y) * 3 + (x + 1);
      res[4] = getColorHex(cubeState.F[idx], '#22C55E');
    }

    // Back Face (-Z)
    if (z === -1) {
      const idx = (1 - y) * 3 + (1 - x);
      res[5] = getColorHex(cubeState.B[idx], '#3B82F6');
    }

    return res;
  }, [x, y, z, cubeState]);

  // Spacing between cubies
  const spacing = 1.03;
  const size = 0.98;
  const stickerSize = 0.88;
  const stickerDepth = 0.005;

  const handlePointerOver = (e: any) => {
    if (onStickerClick) {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (onStickerClick) {
      document.body.style.cursor = 'auto';
    }
  };

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
        <mesh
          position={[size / 2 + stickerDepth, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          onClick={(e) => {
            if (onStickerClick) {
              e.stopPropagation();
              const idx = (1 - y) * 3 + (1 - z);
              onStickerClick('R', idx);
            }
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[0]}
            roughness={colors[0] === EMPTY_STICKER_COLOR ? 0.8 : 0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Left (-X) */}
      {colors[1] && (
        <mesh
          position={[-size / 2 - stickerDepth, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(e) => {
            if (onStickerClick) {
              e.stopPropagation();
              const idx = (1 - y) * 3 + (z + 1);
              onStickerClick('L', idx);
            }
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[1]}
            roughness={colors[1] === EMPTY_STICKER_COLOR ? 0.8 : 0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Up (+Y) */}
      {colors[2] && (
        <mesh
          position={[0, size / 2 + stickerDepth, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => {
            if (onStickerClick) {
              e.stopPropagation();
              const idx = (z + 1) * 3 + (x + 1);
              onStickerClick('U', idx);
            }
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[2]}
            roughness={colors[2] === EMPTY_STICKER_COLOR ? 0.8 : 0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Down (-Y) */}
      {colors[3] && (
        <mesh
          position={[0, -size / 2 - stickerDepth, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => {
            if (onStickerClick) {
              e.stopPropagation();
              const idx = (1 - z) * 3 + (x + 1);
              onStickerClick('D', idx);
            }
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[3]}
            roughness={colors[3] === EMPTY_STICKER_COLOR ? 0.8 : 0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Front (+Z) */}
      {colors[4] && (
        <mesh
          position={[0, 0, size / 2 + stickerDepth]}
          onClick={(e) => {
            if (onStickerClick) {
              e.stopPropagation();
              const idx = (1 - y) * 3 + (x + 1);
              onStickerClick('F', idx);
            }
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[4]}
            roughness={colors[4] === EMPTY_STICKER_COLOR ? 0.8 : 0.25}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Back (-Z) */}
      {colors[5] && (
        <mesh
          position={[0, 0, -size / 2 - stickerDepth]}
          rotation={[0, Math.PI, 0]}
          onClick={(e) => {
            if (onStickerClick) {
              e.stopPropagation();
              const idx = (1 - y) * 3 + (1 - x);
              onStickerClick('B', idx);
            }
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <planeGeometry args={[stickerSize, stickerSize]} />
          <meshStandardMaterial
            color={colors[5]}
            roughness={colors[5] === EMPTY_STICKER_COLOR ? 0.8 : 0.25}
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
