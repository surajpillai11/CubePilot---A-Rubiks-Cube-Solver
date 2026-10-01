import React from 'react';
import { Link } from 'react-router-dom';
import { useCubeStore } from '../store/cubeStore';
import {
  BarChart3,
  Trophy,
  Timer,
  Zap,
  TrendingUp,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Statistics: React.FC = () => {
  const { solveHistory, deleteSolve, clearHistory } = useCubeStore();

  const formatMs = (ms: number): string => {
    const totalSecs = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    const hundredths = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return minutes > 0
      ? `${minutes}:${pad(seconds)}.${pad(hundredths)}`
      : `${pad(seconds)}.${pad(hundredths)}`;
  };

  const totalCount = solveHistory.length;
  const bestTime =
    totalCount > 0 ? Math.min(...solveHistory.map((s) => s.timeMs)) : null;

  const averageTime =
    totalCount > 0
      ? Math.round(solveHistory.reduce((acc, curr) => acc + curr.timeMs, 0) / totalCount)
      : null;

  const averageTps =
    totalCount > 0
      ? (
          solveHistory.reduce((acc, curr) => acc + curr.tps, 0) / totalCount
        ).toFixed(2)
      : null;

  const ao5 =
    totalCount >= 5
      ? Math.round(
          solveHistory
            .slice(0, 5)
            .reduce((acc, curr) => acc + curr.timeMs, 0) / 5
        )
      : null;

  const ao12 =
    totalCount >= 12
      ? Math.round(
          solveHistory
            .slice(0, 12)
            .reduce((acc, curr) => acc + curr.timeMs, 0) / 12
        )
      : null;

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Performance & Practice Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Solve History & Statistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your solve progression, average times, and speed metrics.
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your solve history?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-5 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
            <Timer className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">No Solves Recorded Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your first solve with the timer or solver to start generating your personal
              averages and speedcubing metrics.
            </p>
          </div>
          <Link
            to="/timer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-blue-600/25 transition-all"
          >
            <Timer className="w-4 h-4" />
            <span>Start Practice Timer</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">Total Solves</span>
              <span className="text-2xl font-black font-mono text-white">{totalCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">Best Time</span>
              <span className="text-2xl font-black font-mono text-amber-400">
                {bestTime ? formatMs(bestTime) : '—'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">Average Time</span>
              <span className="text-2xl font-black font-mono text-blue-400">
                {averageTime ? formatMs(averageTime) : '—'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">Average of 5</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {ao5 ? formatMs(ao5) : '—'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">Average of 12</span>
              <span className="text-2xl font-black font-mono text-indigo-400">
                {ao12 ? formatMs(ao12) : '—'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col gap-1">
              <span className="text-[11px] font-mono uppercase text-slate-400">Average TPS</span>
              <span className="text-2xl font-black font-mono text-cyan-400">
                {averageTps ? `${averageTps}` : '—'}
              </span>
            </div>
          </div>

          {/* Solves Table */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col gap-4 overflow-hidden">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Solves</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Scramble Moves</th>
                    <th className="py-2.5 px-3">TPS</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {solveHistory.map((solve, index) => (
                    <tr key={solve.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-semibold">
                        {totalCount - index}
                      </td>
                      <td className="py-3 px-3 text-white font-bold text-sm">
                        {formatMs(solve.timeMs)}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans truncate max-w-xs" title={solve.scramble}>
                        {solve.scramble}
                      </td>
                      <td className="py-3 px-3 text-emerald-400">{solve.tps} tps</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">
                        {new Date(solve.date).toLocaleDateString()} {new Date(solve.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => deleteSolve(solve.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Solve"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
