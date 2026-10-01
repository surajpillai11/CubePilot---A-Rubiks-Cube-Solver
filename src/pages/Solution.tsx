import React from 'react';
import { Link } from 'react-router-dom';
import { CubeCanvas } from '../three/CubeCanvas';
import { SolutionTimeline } from '../components/solver/SolutionTimeline';
import { TutorPanel } from '../components/solver/TutorPanel';
import { CubeMicroSpinner } from '../components/common/CubeMicroSpinner';
import { useCubeStore } from '../store/cubeStore';
import {
  ArrowLeft,
  RotateCcw,
  Wand2,
  Timer,
} from 'lucide-react';

export const Solution: React.FC = () => {
  const { solution, applyScramble, solveCube, isSolving } = useCubeStore();

  const handleQuickScrambleAndSolve = async () => {
    applyScramble();
    await solveCube();
  };

  // Empty state
  if (!solution || solution.steps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-start justify-center max-w-md mx-auto px-4 py-20 gap-4">
        <div className="w-10 h-10 rounded-[6px] bg-surface border border-subtle flex items-center justify-center shadow-2xs">
          <CubeMicroSpinner size={24} className="text-primary" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-primary tracking-tight">
            No active solution
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            Enter your physical cube configuration or generate a test scramble to view the interactive 3D step-by-step solution.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Link
            to="/input"
            className="inline-flex items-center px-3.5 py-1.5 bg-accent hover:opacity-90 active:scale-98 text-white text-xs font-medium rounded-[6px] transition-all shadow-xs"
          >
            Enter cube
          </Link>

          <button
            onClick={handleQuickScrambleAndSolve}
            disabled={isSolving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-hover text-primary border border-subtle text-xs font-medium rounded-[6px] transition-colors cursor-pointer"
          >
            {isSolving ? (
              <CubeMicroSpinner isSolving={true} size={14} className="text-accent" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-accent" />
            )}
            <span>Sample scramble & solve</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-subtle pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/input"
            className="p-1.5 rounded-[6px] border border-subtle hover:bg-surface-hover text-muted hover:text-primary transition-colors"
            title="Back to Cube Input"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
                Solution viewer
              </h1>
              <span className="text-[11px] font-mono text-muted px-2 py-0.5 rounded-[4px] bg-surface border border-subtle">
                {solution.moveCount} moves optimal
              </span>
            </div>
            <p className="text-xs text-muted">
              Follow the 3D step-by-step turns to solve your physical cube.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/input"
            onClick={() => sessionStorage.setItem('cubepilot_keep_state', '1')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-surface border border-subtle hover:bg-surface-hover text-xs font-medium text-muted hover:text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Edit cube</span>
          </Link>

          <Link
            to="/timer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-surface border border-subtle hover:bg-surface-hover text-xs font-medium text-muted hover:text-primary transition-colors"
          >
            <Timer className="w-3 h-3" />
            <span>Speed timer</span>
          </Link>
        </div>
      </div>

      {/* Main 3D Viewer & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Cube Canvas & Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-surface rounded-[6px] border border-subtle p-2 overflow-hidden shadow-2xs">
            <CubeCanvas autoRotate={false} highlightActiveFace={true} />
          </div>

          <SolutionTimeline />
        </div>

        {/* Right Column: Step-by-Step Tutor Panel */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <TutorPanel />
        </div>
      </div>
    </div>
  );
};
