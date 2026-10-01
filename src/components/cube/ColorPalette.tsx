import React from 'react';
import { CubeColor, CUBE_COLORS } from '../../types/cube';
import { useCubeStore } from '../../store/cubeStore';
import { Check, Eraser, RotateCcw, CheckCircle2, Wand2 } from 'lucide-react';

const COLORS_ORDER: CubeColor[] = ['white', 'yellow', 'red', 'orange', 'green', 'blue'];

export const ColorPalette: React.FC = () => {
  const {
    activeColor,
    setActiveColor,
    validationResult,
    startBlank,
    fillRemainingAsSolved,
    applyScramble,
  } = useCubeStore();

  const counts = validationResult.colorCounts;
  const emptyCount = validationResult.emptyCount;
  const filledCount = 54 - emptyCount;

  return (
    <div className="flex flex-col gap-3 p-3 bg-surface border border-subtle rounded-[6px] transition-colors duration-200 shadow-2xs">
      {/* Header with progress */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted">Color palette</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-primary font-medium">
            {filledCount}/54 filled
          </span>
          <div className="w-16 bg-surface-hover h-1.5 rounded-[2px] overflow-hidden border border-subtle">
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{ width: `${(filledCount / 54) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
        {COLORS_ORDER.map((color) => {
          const def = CUBE_COLORS[color];
          const count = counts[color] || 0;
          const isSelected = activeColor === color;
          const isTarget = count === 9;

          return (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-[4px] border transition-all duration-150 cursor-pointer active:scale-92 ${
                isSelected
                  ? 'border-primary bg-surface-hover ring-1 ring-accent/30'
                  : 'border-subtle hover:border-strong bg-page'
              }`}
            >
              <div
                className="w-6 h-6 rounded-[2px] border border-black/20 flex items-center justify-center shrink-0 shadow-2xs"
                style={{ backgroundColor: def.hex }}
              >
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 drop-shadow-xs"
                    style={{ color: def.textColor }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between w-full px-0.5">
                <span className="text-[10px] text-muted truncate">{def.name}</span>
                <span
                  className={`text-[10px] font-mono font-medium ${
                    isTarget
                      ? 'text-primary'
                      : count > 9
                      ? 'text-red-500 font-semibold'
                      : 'text-muted'
                  }`}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}

        {/* Eraser Tool */}
        <button
          onClick={() => setActiveColor('empty')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-[4px] border transition-all duration-150 cursor-pointer active:scale-92 ${
            activeColor === 'empty'
              ? 'border-primary bg-surface-hover ring-1 ring-accent/30'
              : 'border-subtle hover:border-strong bg-page'
          }`}
          title="Erase sticker"
        >
          <div className="w-6 h-6 rounded-[2px] border border-dashed border-strong bg-surface flex items-center justify-center text-muted shrink-0">
            <Eraser className="w-3 h-3" />
          </div>
          <span className="text-[10px] text-muted">Erase</span>
        </button>
      </div>

      {/* Utility Actions */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-subtle text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={startBlank}
            className="flex items-center gap-1 px-2 py-1 bg-surface-hover hover:opacity-85 text-muted hover:text-primary border border-subtle rounded-[4px] transition-colors font-medium text-[11px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to blank</span>
          </button>

          <button
            onClick={fillRemainingAsSolved}
            className="flex items-center gap-1 px-2 py-1 bg-surface-hover hover:opacity-85 text-muted hover:text-primary border border-subtle rounded-[4px] transition-colors font-medium text-[11px] cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Fill remaining</span>
          </button>
        </div>

        <button
          onClick={() => applyScramble()}
          className="flex items-center gap-1 px-2 py-1 bg-surface-hover hover:opacity-85 text-muted hover:text-primary border border-subtle rounded-[4px] transition-colors font-medium text-[11px] cursor-pointer"
        >
          <Wand2 className="w-3 h-3 text-accent" />
          <span>Sample scramble</span>
        </button>
      </div>
    </div>
  );
};
