import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RubiksCube } from './RubiksCube';
import { RotateCcw, Eye, Play, Pause } from 'lucide-react';

interface CubeCanvasProps {
  autoRotate?: boolean;
  highlightActiveFace?: boolean;
  interactivePainting?: boolean;
  showControls?: boolean;
  className?: string;
}

export const CubeCanvas: React.FC<CubeCanvasProps> = ({
  autoRotate: defaultAutoRotate = false,
  highlightActiveFace = true,
  interactivePainting = false,
  showControls = true,
  className = 'w-full h-full min-h-[360px]',
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [autoRotate, setAutoRotate] = useState(defaultAutoRotate);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden select-none ${className}`}>
      <Canvas
        camera={{ position: [5.2, 4.4, 6.2], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-10, 8, -10]} intensity={0.6} color="#60a5fa" />
        <directionalLight position={[0, -10, 0]} intensity={0.3} color="#f8fafc" />

        {/* 3D Rubik's Cube */}
        <RubiksCube
          autoRotate={autoRotate}
          highlightActiveFace={highlightActiveFace}
          interactivePainting={interactivePainting}
        />

        {/* Soft Contact Shadow beneath cube */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.45}
          scale={10}
          blur={2.4}
          far={4}
        />

        {/* Orbit Controls with smooth damping */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          minDistance={4.2}
          maxDistance={12}
        />
      </Canvas>

      {/* Floating View Controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-surface/90 backdrop-blur-sm border border-subtle p-1 rounded-[6px] shadow-sm z-10">
          <button
            onClick={resetCamera}
            className="px-2 py-1 text-muted hover:text-primary hover:bg-surface-hover rounded-[4px] transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Reset Camera View"
            aria-label="Reset Camera View"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset view</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 rounded-[4px] transition-colors flex items-center gap-1.5 text-xs font-medium ${
              autoRotate
                ? 'text-primary bg-surface-active font-semibold'
                : 'text-muted hover:text-primary hover:bg-surface-hover'
            }`}
            title={autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
            aria-label={autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          >
            {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">Orbit</span>
          </button>
        </div>
      )}
    </div>
  );
};
