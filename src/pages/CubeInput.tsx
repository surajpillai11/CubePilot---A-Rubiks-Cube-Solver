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
  Info,
  Palette,
  Eye,
  Wand2,
  RefreshCw,
} from 'lucide-react';

export const CubeInput: React.FC = () => {
  const navigate = useNavigate();
  const { applyPreset, applyScramble, startBlank, validationResult } = useCubeStore();
  const [activeTab, setActiveTab] = useState<'net' | '3d'>('net');

  // Ensure entering the color input starts blank first by default
  React.useEffect(() => {
    // If arriving without explicit 'keep_state' flag and cube is fully painted, start with blank cube
    const keep = sessionStorage.getItem('cubepilot_keep_state');
    if (!keep && validationResult.emptyCount === 0) {
      startBlank();
    }
    // Clean up session flag for future visits
    sessionStorage.removeItem('cubepilot_keep_state');
  }, []);

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
            Enter Your Rubik's Cube Colors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            The cube starts blank with fixed centers. Select a color below and click each blank
            slot to match your physical cube.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={startBlank}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-white/10 transition-colors"
            title="Reset all outer stickers to blank"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Start Blank</span>
          </button>

          <button
            onClick={() => applyScramble()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-xs font-semibold text-purple-300 border border-purple-500/30 transition-colors"
            title="Load a valid test scramble to test solver instantly"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Sample Scramble</span>
          </button>
        </div>
      </div>

      {/* Orientation Guidance Alert */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/50 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">Physical Cube Orientation:</span>
            <span className="text-slate-300 leading-relaxed">
              Hold your cube with <strong>White Center on Top</strong> and{' '}
              <strong>Green Center facing you</strong>. (Red is on the Right, Orange on the Left, Blue on the Back, Yellow on the Bottom).
            </span>
          </div>
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
            <CubeCanvas autoRotate={false} highlightActiveFace={false} interactivePainting={true} />
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
              <span className="text-[11px] text-blue-400 font-medium">Click any sticker in 3D to paint!</span>
            </div>

            <div className="w-full aspect-square max-h-[380px] rounded-2xl bg-slate-950/60 border border-white/5 overflow-hidden">
              <CubeCanvas autoRotate={false} highlightActiveFace={false} interactivePainting={true} />
            </div>
          </div>

          {/* Preset Patterns Card */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col gap-2.5 text-xs text-slate-400">
            <span className="text-slate-200 font-semibold block">Try Preset Patterns:</span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-300 text-left transition-colors"
                >
                  <span className="font-bold text-white block">{p.name}</span>
                  <span className="text-[10px] text-slate-400 truncate block">{p.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
