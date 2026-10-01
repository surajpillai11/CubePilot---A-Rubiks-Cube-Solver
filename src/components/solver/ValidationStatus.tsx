import React from 'react';
import { useCubeStore } from '../../store/cubeStore';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Sparkles,
  Info,
  Wand2,
  Wrench,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ValidationStatusProps {
  onSolveSuccess?: () => void;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ onSolveSuccess }) => {
  const {
    validationResult,
    isSolving,
    solverError,
    solveCube,
    autoFix,
    applyScramble,
    fillRemainingAsSolved,
  } = useCubeStore();
  const navigate = useNavigate();

  const handleSolve = async () => {
    const success = await solveCube();
    if (success) {
      if (onSolveSuccess) {
        onSolveSuccess();
      } else {
        navigate('/solution');
      }
    }
  };

  const handleAutoFixAndSolve = async () => {
    const fixed = autoFix();
    if (fixed) {
      const success = await solveCube();
      if (success) {
        navigate('/solution');
      }
    }
  };

  const { isValid, isComplete, emptyCount, errorTitle, errorMessage, suggestedFix, canAutoFix } =
    validationResult;

  // Case 1: Incomplete (Blank stickers remain)
  if (!isComplete) {
    return (
      <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 text-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              {errorTitle || 'Painting in Progress'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-[11px] text-blue-300/80 font-medium mt-1">
              💡 {suggestedFix}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => fillRemainingAsSolved()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
            title="Auto-fill remaining blank stickers to test solve immediately"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Fill Remaining</span>
          </button>

          <button
            onClick={() => applyScramble()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-semibold transition-colors cursor-pointer"
            title="Load a valid test scramble instead of painting"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Sample Scramble</span>
          </button>

          <div
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold border border-white/5"
            title={`${emptyCount} stickers remaining to be painted`}
          >
            <span>{emptyCount} Blank</span>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Complete (All 54 filled)
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isValid
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Message */}
        <div className="flex items-start gap-3">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
          )}

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              {isValid ? 'Configuration Valid & Solvable' : errorTitle || 'Invalid Cube Configuration'}
            </h4>
            <p className="text-xs text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
              {isValid
                ? 'All 54 stickers and physical pieces are valid. Ready to generate the step-by-step 3D solution.'
                : errorMessage}
            </p>
            {!isValid && suggestedFix && (
              <p className="text-xs text-amber-300/90 font-medium mt-1.5 flex items-center gap-1">
                <span>💡 Tip:</span>
                <span>{suggestedFix}</span>
              </p>
            )}
            {solverError && (
              <p className="text-xs text-rose-400 font-medium mt-2 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                {solverError}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!isValid && (
            <button
              onClick={handleAutoFixAndSolve}
              disabled={isSolving}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer shadow-amber-900/30 active:scale-95"
              title="Automatically fix physical discrepancies or swaps and solve"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Auto-Fix & Solve</span>
            </button>
          )}

          <button
            onClick={handleSolve}
            disabled={!isValid || isSolving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide shadow-lg transition-all cursor-pointer ${
              isValid && !isSolving
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 shadow-blue-900/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
            }`}
          >
            {isSolving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Cube...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Solve Cube Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
