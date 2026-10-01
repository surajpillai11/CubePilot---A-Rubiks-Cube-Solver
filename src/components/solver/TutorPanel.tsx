import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useCubeStore } from '../../store/cubeStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Zap,
  BookOpen,
} from 'lucide-react';

export const TutorPanel: React.FC = () => {
  const {
    solution,
    currentStepIndex,
    isPlaying,
    playSpeed,
    isAnimating,
    tutorMode,
    nextStep,
    prevStep,
    goToStep,
    togglePlay,
    setPlaySpeed,
    setTutorMode,
  } = useCubeStore();

  const totalSteps = solution?.steps.length || 0;
  const isFinished = currentStepIndex >= totalSteps;
  const currentStep = !isFinished && solution ? solution.steps[currentStepIndex] : null;

  // Trigger celebration confetti on solve completion
  useEffect(() => {
    if (isFinished && totalSteps > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
      });
    }
  }, [isFinished, totalSteps]);

  // Autoplay loop timer
  useEffect(() => {
    if (!isPlaying || isFinished || isAnimating) return;

    const delay = Math.max(400, 1100 / playSpeed);
    const timer = setTimeout(() => {
      nextStep();
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, isFinished, isAnimating, currentStepIndex, playSpeed, nextStep]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused on an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        goToStep(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextStep, prevStep, goToStep]);

  if (!solution) return null;

  return (
    <div className="w-full flex flex-col gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
      {/* Header with Mode toggle & Step counter */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isFinished ? 'Solve Completed' : `Step ${currentStepIndex + 1} of ${totalSteps}`}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 font-mono">
            {totalSteps - currentStepIndex} remaining
          </span>
        </div>

        {/* Beginner / Advanced Mode Switch */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-white/10 text-xs font-medium">
          <button
            onClick={() => setTutorMode('beginner')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              tutorMode === 'beginner'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Beginner</span>
          </button>

          <button
            onClick={() => setTutorMode('advanced')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              tutorMode === 'advanced'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      {/* Main Instruction Display */}
      {isFinished ? (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Cube Successfully Solved!
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            All {totalSteps} moves have been executed. Your physical cube should now match the solved 3D cube.
          </p>
          <button
            onClick={() => goToStep(0)}
            className="flex items-center gap-1.5 px-4 py-2 mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay From Beginning</span>
          </button>
        </div>
      ) : currentStep ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Giant Move Badge */}
              <div className="flex flex-col items-center justify-center min-w-[76px] h-[76px] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/25 border border-blue-400/40 font-mono font-black text-3xl">
                <span>{currentStep.move}</span>
              </div>

              {/* Move Name & Direction Summary */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white tracking-tight">
                    {currentStep.explanation.faceName}
                  </span>
                  <span className="text-lg font-mono text-blue-400">
                    {currentStep.explanation.rotationSymbol}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {currentStep.explanation.shortDescription}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Direction: {currentStep.explanation.directionName}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Beginner Guide Box */}
          {tutorMode === 'beginner' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <span>🎯 What to do:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {currentStep.explanation.beginnerInstruction}
                </p>
              </div>

              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-3">
                <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <span>💡 How to hold:</span>
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {currentStep.explanation.relativeTurnTips}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Playback Controls & Speed Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToStep(0)}
            disabled={currentStepIndex === 0 || isAnimating}
            className="p-2.5 rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Restart (Key: R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0 || isAnimating}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold"
            title="Previous Move (Key: ←)"
          >
            <SkipBack className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={togglePlay}
            disabled={isAnimating}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
            title="Play / Pause (Key: Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Solution</span>
              </>
            )}
          </button>

          <button
            onClick={nextStep}
            disabled={isFinished || isAnimating}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-semibold"
            title="Next Move (Key: →)"
          >
            <span>Next</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed multiplier selector */}
        <div className="flex items-center gap-1 bg-slate-800/70 p-1 rounded-xl border border-white/10 text-xs">
          <span className="text-[11px] text-slate-400 px-1 font-medium">Speed:</span>
          {[0.5, 1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaySpeed(spd)}
              className={`px-2 py-1 rounded-lg font-mono text-xs transition-colors ${
                playSpeed === spd
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
