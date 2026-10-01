import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorPalette } from '../components/cube/ColorPalette';
import { CubeNet2D } from '../components/cube/CubeNet2D';
import { ValidationStatus } from '../components/solver/ValidationStatus';
import { CubeCanvas } from '../three/CubeCanvas';
import { useCubeStore } from '../store/cubeStore';
import {
  RotateCcw,
  Wand2,
} from 'lucide-react';

export const CubeInput: React.FC = () => {
  const navigate = useNavigate();
  const { applyScramble, startBlank, validationResult } = useCubeStore();
  const [activeTab, setActiveTab] = useState<'net' | '3d'>('net');

  React.useEffect(() => {
    const keep = sessionStorage.getItem('cubepilot_keep_state');
    if (!keep && validationResult.emptyCount === 0) {
      startBlank();
    }
    sessionStorage.removeItem('cubepilot_keep_state');
  }, []);

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-subtle pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Enter cube
            </h1>
            <span className="text-[11px] font-mono text-muted px-2 py-0.5 rounded-[4px] bg-surface border border-subtle">
              Step 1 of 2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            Select a color and fill the stickers to match your physical cube. Hold with White on top and Green in front.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={startBlank}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-surface hover:bg-surface-hover text-xs font-medium text-muted hover:text-primary border border-subtle transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => applyScramble()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-surface hover:bg-surface-hover text-xs font-medium text-muted hover:text-primary border border-subtle transition-colors cursor-pointer"
          >
            <Wand2 className="w-3 h-3" />
            <span>Sample scramble</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: Left is 2D Net + Palette, Right is 3D Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 2D Net & Palette */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <ColorPalette />

          {/* Mobile View Switcher */}
          <div className="flex lg:hidden bg-surface p-0.5 rounded-[6px] border border-subtle text-xs font-medium">
            <button
              onClick={() => setActiveTab('net')}
              className={`flex-1 py-1 rounded-[4px] transition-colors cursor-pointer ${
                activeTab === 'net' ? 'bg-surface-hover text-primary font-semibold' : 'text-muted'
              }`}
            >
              2D Sticker Net
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex-1 py-1 rounded-[4px] transition-colors cursor-pointer ${
                activeTab === '3d' ? 'bg-surface-hover text-primary font-semibold' : 'text-muted'
              }`}
            >
              3D Viewport
            </button>
          </div>

          {/* 2D Net View */}
          <div className={`${activeTab === 'net' ? 'block' : 'hidden lg:block'} w-full`}>
            <CubeNet2D />
          </div>

          {/* Mobile 3D View */}
          <div
            className={`${
              activeTab === '3d' ? 'block' : 'hidden'
            } lg:hidden w-full aspect-square bg-surface rounded-[6px] border border-subtle p-2 shadow-2xs`}
          >
            <CubeCanvas autoRotate={false} highlightActiveFace={false} interactivePainting={true} />
          </div>

          {/* Validation Status & Solve Action */}
          <ValidationStatus onSolveSuccess={() => navigate('/solution')} />
        </div>

        {/* Right Column: Interactive 3D Model */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-3 sticky top-16">
          <div className="flex flex-col bg-surface border border-subtle rounded-[6px] p-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-subtle">
              <span className="text-xs font-medium text-primary">
                3D Preview
              </span>
              <span className="text-[11px] font-mono text-muted">
                Drag to orbit · Click to paint
              </span>
            </div>

            <div className="w-full aspect-square bg-page rounded-[4px] border border-subtle overflow-hidden">
              <CubeCanvas autoRotate={false} highlightActiveFace={false} interactivePainting={true} />
            </div>

            <div className="pt-2 mt-2 border-t border-subtle flex items-center justify-between text-[11px] text-muted">
              <span>Reference centers:</span>
              <span className="font-mono text-primary font-medium">
                U: White · F: Green · R: Red
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
