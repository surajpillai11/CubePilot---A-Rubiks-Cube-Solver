import React from 'react';
import { useCubeStore } from '../../store/cubeStore';
import { CheckCircle2, AlertTriangle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ValidationStatusProps {
  onSolveSuccess?: () => void;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ onSolveSuccess }) => {
  const { validationResult, isSolving, solverError, solveCube } = useCubeStore();
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

  const { isValid, errorTitle, errorMessage, suggestedFix } = validationResult;

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
            <h4 className="text-sm font-semibold tracking-wide">
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

        {/* Action Button */}
        <button
          onClick={handleSolve}
          disabled={!isValid || isSolving}
          className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide shadow-lg transition-all cursor-pointer ${
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
              <span>Solve Cube</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
