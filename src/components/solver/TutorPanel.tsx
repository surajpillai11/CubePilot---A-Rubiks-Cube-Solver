import React, { useEffect } from 'react';
import { useCubeStore } from '../../store/cubeStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Check,
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

  // Autoplay loop timer
  useEffect(() => {
    if (!isPlaying || isFinished || isAnimating) return;

    const delay = Math.max(350, 1000 / playSpeed);
    const timer = setTimeout(() => {
      nextStep();
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, isFinished, isAnimating, currentStepIndex, playSpeed, nextStep]);

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <div className="w-full flex flex-col gap-3 bg-surface border border-subtle rounded-[6px] p-4 text-xs transition-colors duration-200 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-subtle pb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">
            {isFinished ? 'Solved' : `Step ${currentStepIndex + 1} of ${totalSteps}`}
          </span>
          <span className="text-dim font-mono">
            ({totalSteps - currentStepIndex} remaining)
          </span>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-page p-0.5 rounded-[4px] border border-subtle">
          <button
            onClick={() => setTutorMode('beginner')}
            className={`px-2 py-0.5 rounded-[3px] font-medium transition-colors cursor-pointer ${
              tutorMode === 'beginner'
                ? 'bg-surface-active text-primary font-semibold'
                : 'text-muted hover:text-primary'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setTutorMode('advanced')}
            className={`px-2 py-0.5 rounded-[3px] font-medium transition-colors cursor-pointer ${
              tutorMode === 'advanced'
                ? 'bg-surface-active text-primary font-semibold'
                : 'text-muted hover:text-primary'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Main Instruction Display */}
      {isFinished ? (
        <div className="flex flex-col items-center justify-center py-6 text-center gap-2 animate-move-slide">
          <div className="w-8 h-8 rounded-[4px] bg-surface-hover border border-subtle flex items-center justify-center text-primary shadow-2xs">
            <Check className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm font-semibold text-primary">
            Cube solved successfully
          </span>
          <p className="text-xs text-muted max-w-xs">
            All {totalSteps} moves have been executed. Your physical cube should now be solved.
          </p>
          <button
            onClick={() => goToStep(0)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-hover hover:opacity-85 text-primary border border-subtle rounded-[4px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay solution</span>
          </button>
        </div>
      ) : currentStep ? (
        <div className="flex flex-col gap-3 py-1">
          {/* Active Move Header with slide-in spring animation */}
          <div className="flex items-center justify-between bg-page p-3 rounded-[4px] border border-subtle transition-colors duration-200">
            <div className="flex items-center gap-3">
              <span
                key={`move-${currentStepIndex}-${currentStep.move}`}
                className="font-mono text-3xl font-bold text-primary tracking-tight animate-move-slide inline-block min-w-[48px]"
              >
                {currentStep.move}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary">
                  {currentStep.explanation.faceName} Face ({currentStep.explanation.directionName})
                </span>
                <span className="text-[11px] text-muted">
                  {currentStep.explanation.rotationAngleDeg}° turn {currentStep.explanation.rotationSymbol}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-muted bg-surface px-2 py-1 rounded-[4px] border border-subtle">
              Step #{currentStepIndex + 1}
            </span>
          </div>

          {/* Explanation Text */}
          <div className="flex flex-col gap-1.5 bg-surface-hover/60 p-2.5 rounded-[4px] border border-subtle">
            <p className="text-xs text-primary leading-relaxed">
              {tutorMode === 'beginner'
                ? currentStep.explanation.beginnerInstruction
                : currentStep.explanation.shortDescription}
            </p>
            <span className="text-[11px] text-muted">
              Tip: {currentStep.explanation.relativeTurnTips}
            </span>
          </div>
        </div>
      ) : null}

      {/* Playback Controls */}
      <div className="flex flex-col gap-2 pt-2 border-t border-subtle">
        <div className="flex items-center justify-between">
          {/* Main Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToStep(0)}
              disabled={isAnimating || currentStepIndex === 0}
              className="p-1.5 rounded-[4px] bg-surface hover:bg-surface-hover text-muted hover:text-primary border border-subtle disabled:opacity-40 transition-colors cursor-pointer"
              title="Reset to beginning (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={prevStep}
              disabled={isAnimating || currentStepIndex === 0}
              className="p-1.5 rounded-[4px] bg-surface hover:bg-surface-hover text-muted hover:text-primary border border-subtle disabled:opacity-40 transition-colors cursor-pointer"
              title="Previous step (←)"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={togglePlay}
              disabled={isFinished}
              className={`px-3 py-1.5 rounded-[4px] font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
                isPlaying
                  ? 'bg-surface-hover hover:opacity-85 text-primary border border-subtle'
                  : 'bg-accent hover:opacity-90 text-white'
              }`}
              title="Play / Pause (Space)"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Autoplay</span>
                </>
              )}
            </button>

            <button
              onClick={nextStep}
              disabled={isAnimating || isFinished}
              className="p-1.5 rounded-[4px] bg-surface hover:bg-surface-hover text-muted hover:text-primary border border-subtle disabled:opacity-40 transition-colors cursor-pointer"
              title="Next step (→)"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-page p-0.5 rounded-[4px] border border-subtle">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setPlaySpeed(s)}
                className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono transition-colors cursor-pointer ${
                  playSpeed === s
                    ? 'bg-surface-active text-primary font-semibold'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm String Display */}
        <div className="flex items-center justify-between pt-2 border-t border-subtle text-[11px] text-muted">
          <span className="font-medium text-primary">Full algorithm:</span>
          <span className="font-mono text-muted truncate max-w-[280px]">
            {solution.algorithmString}
          </span>
        </div>
      </div>
    </div>
  );
};
