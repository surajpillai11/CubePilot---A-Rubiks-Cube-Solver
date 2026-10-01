import React, { useRef, useEffect } from 'react';
import { useCubeStore } from '../../store/cubeStore';
import { StandardMove } from '../../types/cube';

export const SolutionTimeline: React.FC = () => {
  const { solution, currentStepIndex, goToStep, isAnimating } = useCubeStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline to keep current active move visible
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStepIndex]);

  if (!solution || solution.steps.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-lg">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-semibold uppercase tracking-wider">Solution Timeline</span>
        <span className="font-mono">
          {currentStepIndex} of {solution.steps.length} moves
        </span>
      </div>

      {/* Move Pills Horizontal Strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-white/10"
      >
        {solution.steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;

          return (
            <button
              key={`${step.move}-${idx}`}
              data-active={isCurrent ? 'true' : 'false'}
              onClick={() => !isAnimating && goToStep(idx)}
              disabled={isAnimating}
              className={`group shrink-0 relative flex flex-col items-center justify-center min-w-[44px] h-12 px-2.5 rounded-xl border font-mono text-sm font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30 scale-105 z-10'
                  : isPassed
                  ? 'bg-slate-800/80 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                  : 'bg-slate-900/40 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="text-xs opacity-60 font-sans font-normal">#{idx + 1}</span>
              <span className="text-base tracking-tight">{step.move}</span>

              {/* Indicator dot */}
              {isCurrent && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-sm animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Final Solved State Pill */}
        <button
          data-active={currentStepIndex === solution.steps.length ? 'true' : 'false'}
          onClick={() => !isAnimating && goToStep(solution.steps.length)}
          disabled={isAnimating}
          className={`shrink-0 flex flex-col items-center justify-center h-12 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            currentStepIndex === solution.steps.length
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>✓</span>
          <span>Solved</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
          style={{
            width: `${(currentStepIndex / solution.steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
