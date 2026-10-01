import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Cubie } from './Cubie';
import { FaceIndicator } from './FaceIndicator';
import { useCubeStore } from '../store/cubeStore';
import { FaceKey, StandardMove } from '../types/cube';

interface RubiksCubeProps {
  autoRotate?: boolean;
  highlightActiveFace?: boolean;
  interactivePainting?: boolean;
}

// All 26 cubie coordinates in 3x3 cube
const CUBIE_COORDINATES: Array<[number, number, number]> = [];
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      if (x === 0 && y === 0 && z === 0) continue; // center core is hidden
      CUBIE_COORDINATES.push([x, y, z]);
    }
  }
}

export const RubiksCube: React.FC<RubiksCubeProps> = ({
  autoRotate = false,
  highlightActiveFace = true,
  interactivePainting = false,
}) => {
  const {
    cubeState,
    lastExecutedMove,
    playSpeed,
    setIsAnimating,
    solution,
    currentStepIndex,
    setSticker,
    activeColor,
  } = useCubeStore();

  const handleStickerClick = useMemo(() => {
    if (!interactivePainting) return undefined;
    return (face: FaceKey, index: number) => {
      setSticker(face, index, activeColor);
    };
  }, [interactivePainting, setSticker, activeColor]);

  const wholeCubeRef = useRef<THREE.Group>(null);
  const rotatingPivotRef = useRef<THREE.Group>(null);
  const staticGroupRef = useRef<THREE.Group>(null);

  // Active move highlight
  const currentMoveToHighlight: StandardMove | null = useMemo(() => {
    if (!highlightActiveFace || !solution) return null;
    if (currentStepIndex < solution.steps.length) {
      return solution.steps[currentStepIndex].move;
    }
    return null;
  }, [highlightActiveFace, solution, currentStepIndex]);

  // Animation state
  const [animatingLayer, setAnimatingLayer] = useState<FaceKey | null>(null);
  const animProgressRef = useRef<{
    active: boolean;
    axis: 'x' | 'y' | 'z';
    targetAngle: number;
    currentAngle: number;
    duration: number; // in seconds
    elapsed: number;
  }>({
    active: false,
    axis: 'y',
    targetAngle: 0,
    currentAngle: 0,
    duration: 0.35,
    elapsed: 0,
  });

  // Trigger animation when lastExecutedMove updates
  useEffect(() => {
    if (!lastExecutedMove) return;

    const move = lastExecutedMove.move;
    const face = move[0] as FaceKey;
    const isPrime = move.endsWith("'");
    const isDouble = move.endsWith('2');

    let axis: 'x' | 'y' | 'z' = 'y';
    let baseAngle = 0;

    switch (face) {
      case 'R':
        axis = 'x';
        baseAngle = -Math.PI / 2;
        break;
      case 'L':
        axis = 'x';
        baseAngle = Math.PI / 2;
        break;
      case 'U':
        axis = 'y';
        baseAngle = -Math.PI / 2;
        break;
      case 'D':
        axis = 'y';
        baseAngle = Math.PI / 2;
        break;
      case 'F':
        axis = 'z';
        baseAngle = -Math.PI / 2;
        break;
      case 'B':
        axis = 'z';
        baseAngle = Math.PI / 2;
        break;
    }

    let targetAngle = baseAngle;
    if (isDouble) {
      targetAngle = baseAngle * 2;
    } else if (isPrime) {
      targetAngle = -baseAngle;
    }

    const duration = Math.max(0.12, 0.32 / playSpeed);

    animProgressRef.current = {
      active: true,
      axis,
      targetAngle,
      currentAngle: 0,
      duration,
      elapsed: 0,
    };

    setAnimatingLayer(face);
    setIsAnimating(true);
  }, [lastExecutedMove, playSpeed, setIsAnimating]);

  // Frame loop for physical layer rotation animation
  useFrame((_, delta) => {
    // Idle auto-rotation when requested and not animating
    if (autoRotate && wholeCubeRef.current && !animProgressRef.current.active) {
      wholeCubeRef.current.rotation.y += delta * 0.35;
      wholeCubeRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.15;
    }

    if (!animProgressRef.current.active || !rotatingPivotRef.current) return;

    const anim = animProgressRef.current;
    anim.elapsed += delta;
    const t = Math.min(1, anim.elapsed / anim.duration);

    // Ease-in-out cubic interpolation
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const currentAngle = anim.targetAngle * ease;
    anim.currentAngle = currentAngle;

    if (anim.axis === 'x') {
      rotatingPivotRef.current.rotation.x = currentAngle;
    } else if (anim.axis === 'y') {
      rotatingPivotRef.current.rotation.y = currentAngle;
    } else if (anim.axis === 'z') {
      rotatingPivotRef.current.rotation.z = currentAngle;
    }

    if (t >= 1) {
      // Completed animation
      anim.active = false;
      if (rotatingPivotRef.current) {
        rotatingPivotRef.current.rotation.set(0, 0, 0);
      }
      setAnimatingLayer(null);
      setIsAnimating(false);
    }
  });

  // Filter which cubies belong to the active turning layer
  const isCubieInLayer = (coord: [number, number, number], layer: FaceKey | null): boolean => {
    if (!layer) return false;
    const [x, y, z] = coord;
    switch (layer) {
      case 'R': return x === 1;
      case 'L': return x === -1;
      case 'U': return y === 1;
      case 'D': return y === -1;
      case 'F': return z === 1;
      case 'B': return z === -1;
    }
  };

  const rotatingCubies = useMemo(() => {
    if (!animatingLayer) return [];
    return CUBIE_COORDINATES.filter((coord) => isCubieInLayer(coord, animatingLayer));
  }, [animatingLayer]);

  const staticCubies = useMemo(() => {
    if (!animatingLayer) return CUBIE_COORDINATES;
    return CUBIE_COORDINATES.filter((coord) => !isCubieInLayer(coord, animatingLayer));
  }, [animatingLayer]);

  return (
    <group ref={wholeCubeRef}>
      {/* Static layer cubies */}
      <group ref={staticGroupRef}>
        {staticCubies.map(([x, y, z]) => (
          <Cubie
            key={`${x},${y},${z}`}
            x={x}
            y={y}
            z={z}
            cubeState={cubeState}
            isHighlighted={currentMoveToHighlight ? isCubieInLayer([x, y, z], currentMoveToHighlight[0] as FaceKey) : false}
            onStickerClick={handleStickerClick}
          />
        ))}
      </group>

      {/* Rotating layer cubies */}
      <group ref={rotatingPivotRef}>
        {rotatingCubies.map(([x, y, z]) => (
          <Cubie
            key={`rot-${x},${y},${z}`}
            x={x}
            y={y}
            z={z}
            cubeState={cubeState}
            isHighlighted={true}
            onStickerClick={handleStickerClick}
          />
        ))}
      </group>

      {/* Face Highlighting & Directional Turning Indicator */}
      <FaceIndicator currentMove={currentMoveToHighlight} />
    </group>
  );
};
