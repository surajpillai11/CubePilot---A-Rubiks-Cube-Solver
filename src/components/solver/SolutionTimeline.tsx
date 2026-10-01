import React, { useRef, useEffect } from 'react';
import { useCubeStore } from '../../store/cubeStore';

export const SolutionTimeline: React.FC = () => {
  const { solution, currentStepIndex, goToStep, isAnimating } = useCubeStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStepIndex]);

  if (!solution || solution.steps.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2 bg-surface border border-subtle rounded-[6px] p-3 transition-colors duration-200 shadow-2xs">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-medium text-primary">Timeline</span>
        <span className="font-mono text-[11px]">
          {currentStepIndex} of {solution.steps.length} moves
        </span>
      </div>

      {/* Move buttons horizontal strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth"
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
              className={`shrink-0 flex flex-col items-center justify-center min-w-[38px] h-10 px-2 rounded-[4px] border font-mono text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isCurrent
                  ? 'bg-accent border-accent text-white shadow-xs scale-105 z-10 ring-2 ring-accent/30'
                  : isPassed
                  ? 'bg-surface border-subtle text-dim hover:text-muted'
                  : 'bg-surface-hover border-subtle text-primary hover:border-strong'
              }`}
            >
              <span className="text-[9px] opacity-70 font-sans font-normal">#{idx + 1}</span>
              <span className="text-xs">{step.move}</span>
            </button>
          );
        })}

        {/* Final Solved State */}
        <button
          data-active={currentStepIndex === solution.steps.length ? 'true' : 'false'}
          onClick={() => !isAnimating && goToStep(solution.steps.length)}
          disabled={isAnimating}
          className={`shrink-0 flex items-center justify-center h-10 px-2.5 rounded-[4px] border text-xs font-medium transition-all duration-150 cursor-pointer ${
            currentStepIndex === solution.steps.length
              ? 'bg-accent border-accent text-white shadow-xs scale-105 z-10 ring-2 ring-accent/30'
              : 'bg-surface border-subtle text-dim hover:text-muted'
          }`}
        >
          <span>Solved</span>
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-surface-hover h-1.5 rounded-[2px] overflow-hidden border border-subtle">
        <div
          className="bg-accent h-full transition-all duration-200"
          style={{
            width: `${(currentStepIndex / solution.steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
