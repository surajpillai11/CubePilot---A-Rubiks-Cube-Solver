import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorPalette } from '../components/cube/ColorPalette';
import { CubeNet2D } from '../components/cube/CubeNet2D';
import { ValidationStatus } from '../components/solver/ValidationStatus';
import { CubeCanvas } from '../three/CubeCanvas';
import { useCubeStore } from '../store/cubeStore';
import { PRESET_PATTERNS } from '../cube/CubeState';
import {
  Layers,
  Sparkles,
  Info,
  Wand2,
  RotateCcw,
  Palette,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const CubeInput: React.FC = () => {
  const navigate = useNavigate();
  const { applyPreset, applyScramble, resetCube, autoFillCenters, validationResult } =
    useCubeStore();
  const [activeTab, setActiveTab] = useState<'net' | '3d'>('net');

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      {/* Page Title & Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>Step 1: Configuration Input</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Enter Your Rubik's Cube
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Select a color below, then click each sticker on the 2D net to match your physical cube.
            The live 3D preview and mathematical validator update in real time.
          </p>
        </div>

        {/* Quick presets picker */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Presets:</span>
          {PRESET_PATTERNS.slice(0, 3).map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left is Color Palette + 2D Net, Right is 3D Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Color Palette & Net */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <ColorPalette />

          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('net')}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'net' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D Sticker Net</span>
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === '3d' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Live 3D Preview</span>
            </button>
          </div>

          {/* 2D Net View */}
          <div className={`${activeTab === 'net' ? 'block' : 'hidden lg:block'} w-full`}>
            <CubeNet2D />
          </div>

          {/* Mobile 3D Preview View */}
          <div
            className={`${
              activeTab === '3d' ? 'block' : 'hidden'
            } lg:hidden w-full aspect-square bg-slate-900/40 rounded-3xl border border-white/10 p-2`}
          >
            <CubeCanvas autoRotate={false} highlightActiveFace={false} />
          </div>

          {/* Live Validation Alert & Solve Button */}
          <ValidationStatus onSolveSuccess={() => navigate('/solution')} />
        </div>

        {/* Right Column: Desktop Live 3D Preview & Tips */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-5 sticky top-24">
          <div className="flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Live 3D Cube Preview</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Drag to rotate</span>
            </div>

            <div className="w-full aspect-square max-h-[380px] rounded-2xl bg-slate-950/60 border border-white/5 overflow-hidden">
              <CubeCanvas autoRotate={false} highlightActiveFace={false} />
            </div>
          </div>

          {/* Helpful Tips Card */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col gap-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Standard Orientation Guidance</span>
            </div>
            <p className="leading-relaxed">
              Hold your physical cube with the <strong>White center on top</strong> and the{' '}
              <strong>Green center facing you</strong>. The Red center is on your right, Orange on
              your left, Blue on the back, and Yellow on the bottom.
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[11px] text-slate-400 font-mono">
              <span>U: White</span> • <span>D: Yellow</span> • <span>F: Green</span> •{' '}
              <span>R: Red</span> • <span>B: Blue</span> • <span>L: Orange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
