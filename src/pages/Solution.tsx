import React from 'react';
import { Link } from 'react-router-dom';
import { CubeCanvas } from '../three/CubeCanvas';
import { SolutionTimeline } from '../components/solver/SolutionTimeline';
import { TutorPanel } from '../components/solver/TutorPanel';
import { useCubeStore } from '../store/cubeStore';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Palette,
  Wand2,
  CheckCircle2,
  Timer,
  Layers,
} from 'lucide-react';

export const Solution: React.FC = () => {
  const { solution, applyScramble, solveCube, isSolving } = useCubeStore();

  const handleQuickScrambleAndSolve = async () => {
    applyScramble();
    await solveCube();
  };

  // Empty state if user navigated to /solution without an active solve
  if (!solution || solution.steps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-20 text-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
          <Layers className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            No Solution in Progress
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter your physical cube configuration or test our solver immediately with a random
            scramble to experience the 3D step-by-step interactive tutor.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/input"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/25 transition-all"
          >
            <Palette className="w-4 h-4" />
            <span>Enter My Cube Colors</span>
          </Link>

          <button
            onClick={handleQuickScrambleAndSolve}
            disabled={isSolving}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>Generate & Solve Scramble</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/input"
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Back to Cube Input"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
                Step 2: 3D Solution Tutor
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                {solution.moveCount} moves optimal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Interactive 3D Solution Viewer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/input"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-medium text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Edit Cube</span>
          </Link>

          <Link
            to="/timer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-medium text-blue-300 transition-colors"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Practice with Timer</span>
          </Link>
        </div>
      </div>

      {/* Main 3D Viewer & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Rubik's Cube Canvas Container */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-2 overflow-hidden">
            <CubeCanvas autoRotate={false} highlightActiveFace={true} />
          </div>

          {/* Solution Timeline Move Pills */}
          <SolutionTimeline />
        </div>

        {/* Right Column: Step-by-Step Tutor Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <TutorPanel />
        </div>
      </div>
    </div>
  );
};
