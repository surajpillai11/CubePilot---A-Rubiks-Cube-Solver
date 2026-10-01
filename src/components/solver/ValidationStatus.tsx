import React from 'react';
import { useCubeStore } from '../../store/cubeStore';
import {
  Check,
  AlertCircle,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { CubeMicroSpinner } from '../common/CubeMicroSpinner';
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
    autoFix();
    const success = await solveCube();
    if (success) {
      if (onSolveSuccess) {
        onSolveSuccess();
      } else {
        navigate('/solution');
      }
    }
  };

  const { isValid, isComplete, emptyCount, errorTitle, errorMessage, suggestedFix, canAutoFix } =
    validationResult;

  // Incomplete state
  if (!isComplete) {
    return (
      <div className="p-3 bg-surface border border-subtle rounded-[6px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors duration-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-dim shrink-0" />
          <div>
            <span className="font-medium text-primary">
              {errorTitle || 'Configuration in progress'}
            </span>
            <span className="text-muted ml-2 font-mono">
              ({54 - emptyCount}/54 stickers filled)
            </span>
          </div>
        </div>

        <span className="text-muted font-mono text-[11px]">
          {emptyCount} blank stickers remaining
        </span>
      </div>
    );
  }

  // Complete state
  return (
    <div className={`p-3.5 bg-surface border rounded-[6px] flex flex-col gap-3 text-xs transition-all duration-200 shadow-2xs ${
      isValid ? 'border-accent/40 animate-pulse-subtle' : 'border-subtle'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status Text */}
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0">
            {isValid ? (
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block shadow-xs" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-muted" />
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-primary">
              {isValid
                ? 'Valid cube configuration'
                : errorTitle || 'Configuration mismatch detected'}
            </span>
            <p className="text-muted text-[11px] leading-relaxed max-w-xl">
              {isValid
                ? 'All pieces and colors are verified. Ready to generate step-by-step 3D solution.'
                : errorMessage}
            </p>
            {!isValid && suggestedFix && (
              <span className="text-muted text-[11px] mt-0.5">
                {suggestedFix}
              </span>
            )}
            {solverError && (
              <span className="text-red-500 text-[11px] mt-1 font-mono">
                {solverError}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          {!isValid && (
            <button
              onClick={handleAutoFixAndSolve}
              disabled={isSolving}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-hover hover:opacity-85 text-primary border border-subtle rounded-[6px] font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSolving ? (
                <CubeMicroSpinner isSolving={true} size={14} className="text-primary" />
              ) : (
                <Wrench className="w-3.5 h-3.5 text-muted" />
              )}
              <span>Auto-fix & solve</span>
            </button>
          )}

          <button
            onClick={handleSolve}
            disabled={isSolving}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-accent hover:opacity-90 text-white rounded-[6px] font-medium text-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98 shadow-2xs"
          >
            {isSolving ? (
              <>
                <CubeMicroSpinner isSolving={true} size={14} className="text-white" />
                <span>Computing...</span>
              </>
            ) : (
              <>
                <span>Solve cube</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
