import React from 'react';
import { CubeColor, CUBE_COLORS } from '../../types/cube';
import { useCubeStore } from '../../store/cubeStore';
import { Check, Sparkles, RefreshCw, Wand2 } from 'lucide-react';

const COLORS_ORDER: CubeColor[] = ['white', 'yellow', 'red', 'orange', 'green', 'blue'];

export const ColorPalette: React.FC = () => {
  const {
    activeColor,
    setActiveColor,
    validationResult,
    resetCube,
    autoFillCenters,
    applyScramble,
  } = useCubeStore();

  const counts = validationResult.colorCounts;

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Selected Paint Color
        </span>
        <span className="text-xs text-slate-400">
          Click a color, then click stickers on the net
        </span>
      </div>

      {/* Color Swatches with live count badges */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {COLORS_ORDER.map((color) => {
          const def = CUBE_COLORS[color];
          const count = counts[color] || 0;
          const isSelected = activeColor === color;
          const isTarget = count === 9;

          return (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-400 ring-2 ring-blue-500/30 bg-white/5 scale-[1.03]'
                  : 'border-white/10 hover:border-white/20 bg-slate-800/40 hover:bg-white/5'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg shadow-md flex items-center justify-center border border-white/20 transition-transform"
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
                <span className="text-xs font-medium text-slate-200">{def.name}</span>
                <span
                  className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${
                    isTarget
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : count > 9
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}
                >
                  {count}/9 {isTarget && '✓'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
        <div className="flex items-center gap-1.5">
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
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors font-medium"
            title="Apply a random valid WCA scramble to test"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Random Scramble</span>
          </button>
        </div>

        <button
          onClick={resetCube}
          className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/10 rounded-lg transition-colors font-medium"
          title="Reset cube to solved state"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Cube</span>
        </button>
      </div>
    </div>
  );
};
