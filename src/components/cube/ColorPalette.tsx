import React from 'react';
import { CubeColor, CUBE_COLORS } from '../../types/cube';
import { useCubeStore } from '../../store/cubeStore';
import { Check, Sparkles, RefreshCw, Wand2, Eraser, CheckCircle2 } from 'lucide-react';

const COLORS_ORDER: CubeColor[] = ['white', 'yellow', 'red', 'orange', 'green', 'blue'];

export const ColorPalette: React.FC = () => {
  const {
    activeColor,
    setActiveColor,
    validationResult,
    startBlank,
    fillSolved,
    fillRemainingAsSolved,
    autoFillCenters,
    applyScramble,
  } = useCubeStore();

  const counts = validationResult.colorCounts;
  const emptyCount = validationResult.emptyCount;
  const filledCount = 54 - emptyCount;

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
      {/* Header with progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Paint Color Palette
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-300">
            {filledCount}/54 Painted {emptyCount > 0 ? `(${emptyCount} blank)` : '✓ All Filled'}
          </span>
          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                emptyCount === 0 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(filledCount / 54) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Color Swatches with live count badges */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {COLORS_ORDER.map((color) => {
          const def = CUBE_COLORS[color];
          const count = counts[color] || 0;
          const isSelected = activeColor === color;
          const isTarget = count === 9;

          return (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-400 ring-2 ring-blue-500/30 bg-white/5 scale-[1.03]'
                  : 'border-white/10 hover:border-white/20 bg-slate-800/40 hover:bg-white/5'
              }`}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-md flex items-center justify-center border border-white/20 transition-transform"
                style={{ backgroundColor: def.hex }}
              >
                {isSelected && (
                  <Check
                    className="w-4 h-4 drop-shadow"
                    style={{ color: def.textColor }}
                  />
                )}
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-medium text-slate-200">{def.name}</span>
                <span
                  className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full mt-0.5 ${
                    isTarget
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : count > 9
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {count}/9
                </span>
              </div>
            </button>
          );
        })}

        {/* Eraser / Blank Tool */}
        <button
          onClick={() => setActiveColor('empty')}
          className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
            activeColor === 'empty'
              ? 'border-slate-400 ring-2 ring-slate-400/30 bg-white/10 scale-[1.03]'
              : 'border-white/10 hover:border-white/20 bg-slate-800/40 hover:bg-white/5'
          }`}
          title="Click stickers to erase back to blank"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-md flex items-center justify-center border border-dashed border-slate-500 bg-slate-800 text-slate-400">
            <Eraser className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[11px] font-medium text-slate-300">Eraser</span>
            <span className="text-[10px] font-mono text-slate-500 mt-0.5">Blank</span>
          </div>
        </button>
      </div>

      {/* Helper Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={startBlank}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-lg transition-colors font-medium"
            title="Clear all 48 outer stickers to blank, keeping standard centers"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear to Blank</span>
          </button>

          <button
            onClick={autoFillCenters}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors font-medium"
            title="Auto-fill center stickers with standard Western Rubik's scheme"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Fill Centers</span>
          </button>

          <button
            onClick={() => applyScramble()}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors font-medium cursor-pointer"
            title="Apply a random valid WCA scramble to test solver immediately"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Sample Scramble</span>
          </button>

          {emptyCount > 0 && emptyCount < 54 && (
            <button
              onClick={fillRemainingAsSolved}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg transition-colors font-medium cursor-pointer"
              title="Auto-fill the remaining blank slots with standard solved colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fill Remaining ({emptyCount})</span>
            </button>
          )}
        </div>

        <button
          onClick={fillSolved}
          className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/10 rounded-lg transition-colors font-medium"
          title="Fill entire cube with solved colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Fill Solved</span>
        </button>
      </div>
    </div>
  );
};
