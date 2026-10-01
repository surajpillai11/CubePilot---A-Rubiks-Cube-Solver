import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCubeStore } from '../store/cubeStore';
import { generateRandomScramble } from '../cube/CubeState';
import {
  Timer as TimerIcon,
  RotateCcw,
} from 'lucide-react';
import type { SolveRecord } from '../types/cube';

export const Timer: React.FC = () => {
  const { recordSolve, solveHistory } = useCubeStore();

  const [scramble, setScramble] = useState<string>('');
  const [scrambleMoves, setScrambleMoves] = useState<string[]>([]);

  // Timer states: 'idle' | 'holding' | 'ready' | 'running' | 'stopped'
  const [timerState, setTimerState] = useState<'idle' | 'holding' | 'ready' | 'running' | 'stopped'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const holdTimeoutRef = useRef<any>(null);

  // Generate initial scramble
  const newScramble = useCallback(() => {
    const sc = generateRandomScramble(21);
    setScramble(sc.scrambleString);
    setScrambleMoves(sc.moves);
  }, []);

  useEffect(() => {
    newScramble();
  }, [newScramble]);

  // Frame loop when timer is running
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

    // Record solve in history
    recordSolve(Math.round(finalTime), scrambleMoves.length, scramble);
    newScramble();
  }, [scrambleMoves, scramble, recordSolve, newScramble]);

  // Keyboard handlers for Spacebar
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
          // Hold for 350ms to turn green (Ready)
          holdTimeoutRef.current = setTimeout(() => {
            setTimerState('ready');
          }, 350);
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
        // Released too early
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

  // Touch handlers for mobile devices
  const handleTouchStart = () => {
    if (timerState === 'running') {
      stopTimer();
    } else if (timerState === 'idle' || timerState === 'stopped') {
      setTimerState('holding');
      holdTimeoutRef.current = setTimeout(() => {
        setTimerState('ready');
      }, 350);
    }
  };

  const handleTouchEnd = () => {
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

  // Format milliseconds into 00:24.83
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

  // Compute best time & Ao5
  const bestTime =
    solveHistory.length > 0 ? Math.min(...solveHistory.map((s: SolveRecord) => s.timeMs)) : null;

  const ao5 =
    solveHistory.length >= 5
      ? Math.round(
          solveHistory
            .slice(0, 5)
            .reduce((acc: number, curr: SolveRecord) => acc + curr.timeMs, 0) / 5
        )
      : null;

  return (
    <div
      className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 gap-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header & Scramble Bar */}
      <div className="flex flex-col gap-3 p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5 text-blue-400">
            <TimerIcon className="w-3.5 h-3.5" />
            <span>WCA Official Scramble</span>
          </span>
          <button
            onClick={newScramble}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>New Scramble</span>
          </button>
        </div>

        <div className="text-center py-2 px-3 bg-slate-950/60 rounded-2xl border border-white/5 font-mono text-sm sm:text-base font-semibold text-slate-200 tracking-wide leading-relaxed">
          {scramble}
        </div>
      </div>

      {/* Main Big Timer Display Area */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
        <div
          className={`font-mono font-black text-6xl sm:text-8xl lg:text-9xl tracking-tight transition-colors duration-150 ${
            timerState === 'ready'
              ? 'text-emerald-400 scale-105'
              : timerState === 'holding'
              ? 'text-rose-400'
              : timerState === 'running'
              ? 'text-white'
              : 'text-slate-100'
          }`}
        >
          {formatTime(elapsedTime)}
        </div>

        {/* Guidance Prompt */}
        <div className="text-xs sm:text-sm font-medium tracking-wide">
          {timerState === 'idle' || timerState === 'stopped' ? (
            <span className="text-slate-400">
              Hold <kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-slate-200">Space</kbd> or touch screen to ready
            </span>
          ) : timerState === 'holding' ? (
            <span className="text-rose-400 animate-pulse">Wait for green...</span>
          ) : timerState === 'ready' ? (
            <span className="text-emerald-400 font-bold">Release to start timing!</span>
          ) : (
            <span className="text-blue-400 font-semibold">Timing... Tap space to stop</span>
          )}
        </div>
      </div>

      {/* Stats Cards: Best Time, Ao5, Last TPS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col p-4 rounded-2xl bg-slate-900/40 border border-white/10">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Personal Best</span>
          <span className="text-lg font-bold font-mono text-white mt-1">
            {bestTime ? formatTime(bestTime) : '—'}
          </span>
        </div>

        <div className="flex flex-col p-4 rounded-2xl bg-slate-900/40 border border-white/10">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Average of 5</span>
          <span className="text-lg font-bold font-mono text-white mt-1">
            {ao5 ? formatTime(ao5) : '—'}
          </span>
        </div>

        <div className="flex flex-col p-4 rounded-2xl bg-slate-900/40 border border-white/10">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Total Solves</span>
          <span className="text-lg font-bold font-mono text-white mt-1">
            {solveHistory.length}
          </span>
        </div>

        <div className="flex flex-col p-4 rounded-2xl bg-slate-900/40 border border-white/10">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Last TPS</span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1">
            {solveHistory[0] ? `${solveHistory[0].tps} tps` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};
