import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCubeStore } from '../store/cubeStore';
import { generateRandomScramble } from '../cube/CubeState';
import {
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';

export const Timer: React.FC = () => {
  const { recordSolve, solveHistory } = useCubeStore();

  const [scramble, setScramble] = useState<string>('');
  const [scrambleMoves, setScrambleMoves] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Timer states: 'idle' | 'holding' | 'ready' | 'running' | 'stopped'
  const [timerState, setTimerState] = useState<'idle' | 'holding' | 'ready' | 'running' | 'stopped'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const holdTimeoutRef = useRef<any>(null);

  const newScramble = useCallback(() => {
    const sc = generateRandomScramble(21);
    setScramble(sc.scrambleString);
    setScrambleMoves(sc.moves);
  }, []);

  useEffect(() => {
    newScramble();
  }, [newScramble]);

  const updateTimer = () => {
    setElapsedTime(performance.now() - startTimeRef.current);
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setTimerState('running');
    requestRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const stopTimer = useCallback(() => {
    cancelAnimationFrame(requestRef.current);
    const finalTime = performance.now() - startTimeRef.current;
    setElapsedTime(finalTime);
    setTimerState('stopped');

    recordSolve(Math.round(finalTime), scrambleMoves.length, scramble);
    newScramble();
  }, [scrambleMoves, scramble, recordSolve, newScramble]);

  // Spacebar controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      e.preventDefault();

      if (timerState === 'running') {
        stopTimer();
      } else if (timerState === 'idle' || timerState === 'stopped') {
        setTimerState('holding');
        if (!holdTimeoutRef.current) {
          holdTimeoutRef.current = setTimeout(() => {
            setTimerState('ready');
          }, 300);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      e.preventDefault();

      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }

      if (timerState === 'ready') {
        startTimer();
      } else if (timerState === 'holding') {
        setTimerState('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [timerState, startTimer, stopTimer]);

  const formatTime = (ms: number): string => {
    const totalSecs = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    const hundredths = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return minutes > 0
      ? `${minutes}:${pad(seconds)}.${pad(hundredths)}`
      : `${pad(seconds)}.${pad(hundredths)}`;
  };

  const handleCopyScramble = () => {
    navigator.clipboard.writeText(scramble);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalCount = solveHistory.length;
  const bestTime = totalCount > 0 ? Math.min(...solveHistory.map((s) => s.timeMs)) : null;
  const ao5 =
    totalCount >= 5
      ? Math.round(solveHistory.slice(0, 5).reduce((acc, curr) => acc + curr.timeMs, 0) / 5)
      : null;

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-subtle pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
            Speed timer
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Hold Space to prepare · Release to start · Press any key to stop.
          </p>
        </div>

        <button
          onClick={newScramble}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface hover:bg-surface-hover text-muted hover:text-primary border border-subtle rounded-[6px] text-xs font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>New scramble</span>
        </button>
      </div>

      {/* Main Grid: Left is Timer Workspace, Right is Stats Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timer & Scramble */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Scramble Display Box */}
          <div className="flex items-center justify-between p-3.5 bg-surface border border-subtle rounded-[6px] shadow-2xs">
            <span className="font-mono text-sm sm:text-base text-primary tracking-wider select-all font-medium">
              {scramble}
            </span>
            <button
              onClick={handleCopyScramble}
              className="p-1.5 text-muted hover:text-primary hover:bg-surface-hover rounded-[4px] border border-subtle transition-colors ml-3 cursor-pointer shrink-0"
              title="Copy scramble"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Large Clean Timer Viewport with hold charge effect */}
          <div
            className={`w-full min-h-[300px] sm:min-h-[360px] bg-surface border rounded-[6px] flex flex-col items-center justify-center p-6 select-none transition-all duration-200 shadow-2xs relative overflow-hidden ${
              timerState === 'ready'
                ? 'border-accent shadow-md shadow-accent/10 ring-2 ring-accent/20'
                : timerState === 'holding'
                ? 'border-amber-500/60'
                : 'border-subtle'
            }`}
          >
            {/* Top hold charge indicator bar */}
            {timerState === 'holding' && (
              <div className="absolute top-0 left-0 h-1 bg-amber-500 animate-[width_0.3s_linear_forwards] w-full" />
            )}
            {timerState === 'ready' && (
              <div className="absolute top-0 left-0 h-1 bg-accent w-full" />
            )}

            <span
              className={`font-mono font-bold tracking-tight transition-all duration-150 text-6xl sm:text-7xl lg:text-8xl tabular-nums ${
                timerState === 'ready'
                  ? 'text-accent scale-105'
                  : timerState === 'holding'
                  ? 'text-amber-500'
                  : timerState === 'running'
                  ? 'text-primary'
                  : 'text-primary'
              }`}
            >
              {formatTime(elapsedTime)}
            </span>

            <span className={`text-xs font-mono mt-4 transition-colors ${
              timerState === 'ready'
                ? 'text-accent font-semibold animate-pulse'
                : timerState === 'holding'
                ? 'text-amber-500'
                : 'text-muted'
            }`}>
              {timerState === 'running'
                ? 'Running · Press space to stop'
                : timerState === 'ready'
                ? 'READY · Release to start!'
                : timerState === 'holding'
                ? 'Hold...'
                : 'Hold Space to start'}
            </span>
          </div>
        </div>

        {/* Right Column: Dense Stats & Solves Table */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-surface border border-subtle rounded-[6px] flex flex-col gap-0.5 shadow-2xs">
              <span className="text-[10px] text-muted uppercase font-mono">Best</span>
              <span className="font-mono font-semibold text-primary">
                {bestTime ? formatTime(bestTime) : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-surface border border-subtle rounded-[6px] flex flex-col gap-0.5 shadow-2xs">
              <span className="text-[10px] text-muted uppercase font-mono">Ao5</span>
              <span className="font-mono font-semibold text-primary">
                {ao5 ? formatTime(ao5) : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-surface border border-subtle rounded-[6px] flex flex-col gap-0.5 shadow-2xs">
              <span className="text-[10px] text-muted uppercase font-mono">Solves</span>
              <span className="font-mono font-semibold text-primary">{totalCount}</span>
            </div>
          </div>

          {/* Recent Solves Table */}
          <div className="bg-surface border border-subtle rounded-[6px] p-3 flex flex-col gap-2 text-xs shadow-2xs">
            <span className="font-medium text-primary">Recent Solves</span>
            {totalCount === 0 ? (
              <span className="text-xs text-muted py-4 text-center">
                No solves recorded yet
              </span>
            ) : (
              <div className="flex flex-col divide-y divide-subtle max-h-[300px] overflow-y-auto">
                {solveHistory.slice(0, 10).map((s, idx) => (
                  <div key={s.id} className="py-1.5 flex items-center justify-between text-[11px] hover:bg-surface-hover/50 px-1 rounded-[3px] transition-colors">
                    <span className="text-muted font-mono">#{totalCount - idx}</span>
                    <span className="font-mono font-medium text-primary">
                      {formatTime(s.timeMs)}
                    </span>
                    <span className="text-muted font-mono">{s.tps} tps</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
