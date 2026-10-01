import React from 'react';
import { Link } from 'react-router-dom';
import { useCubeStore } from '../store/cubeStore';
import { BarChart2, Timer, Trash2 } from 'lucide-react';

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
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4">
        <div>
          <div className="text-[11px] font-mono text-muted uppercase tracking-wider">
            Practice Records
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight mt-1">
            Solve statistics
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Historical solve logs, averages, and execution speed.
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Delete all recorded solve history?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-subtle text-muted hover:text-primary hover:bg-surface-hover text-xs font-medium transition-colors w-fit cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {totalCount === 0 ? (
        <div className="flex flex-col items-start justify-center py-16 gap-4 max-w-md border border-subtle bg-surface p-6 rounded-[6px] shadow-2xs">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-semibold text-primary">No solves recorded yet</h2>
            <p className="text-xs text-muted leading-relaxed">
              Use the speed timer to record practice solves and build your Ao5 and Ao12 benchmarks.
            </p>
          </div>
          <Link
            to="/timer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-accent hover:opacity-90 active:scale-98 text-white text-xs font-medium transition-all shadow-xs"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Open practice timer</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-[6px] bg-surface border border-subtle flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-muted">Solves</span>
              <span className="text-xl font-semibold font-mono text-primary">{totalCount}</span>
            </div>

            <div className="p-3.5 rounded-[6px] bg-surface border border-subtle flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-muted">Best</span>
              <span className="text-xl font-semibold font-mono text-primary">
                {bestTime ? formatMs(bestTime) : '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-[6px] bg-surface border border-subtle flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-muted">Average</span>
              <span className="text-xl font-semibold font-mono text-primary">
                {averageTime ? formatMs(averageTime) : '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-[6px] bg-surface border border-subtle flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-muted">Ao5</span>
              <span className="text-xl font-semibold font-mono text-primary">
                {ao5 ? formatMs(ao5) : '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-[6px] bg-surface border border-subtle flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-muted">Ao12</span>
              <span className="text-xl font-semibold font-mono text-primary">
                {ao12 ? formatMs(ao12) : '—'}
              </span>
            </div>

            <div className="p-3.5 rounded-[6px] bg-surface border border-subtle flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-muted">Average TPS</span>
              <span className="text-xl font-semibold font-mono text-primary">
                {averageTps ? `${averageTps}` : '—'}
              </span>
            </div>
          </div>

          {/* Solves Table */}
          <div className="rounded-[6px] bg-surface border border-subtle flex flex-col overflow-hidden shadow-2xs">
            <div className="px-4 py-3 border-b border-subtle flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Recent session solves</span>
              <span className="text-[11px] font-mono text-muted">{totalCount} total entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-subtle text-muted font-mono text-[11px] uppercase bg-surface-hover/50">
                    <th className="py-2.5 px-4 font-medium">#</th>
                    <th className="py-2.5 px-4 font-medium">Time</th>
                    <th className="py-2.5 px-4 font-medium">Scramble</th>
                    <th className="py-2.5 px-4 font-medium">TPS</th>
                    <th className="py-2.5 px-4 font-medium">Timestamp</th>
                    <th className="py-2.5 px-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle font-mono">
                  {solveHistory.map((solve, index) => (
                    <tr key={solve.id} className="hover:bg-surface-hover/70 transition-colors">
                      <td className="py-2.5 px-4 text-muted">
                        {totalCount - index}
                      </td>
                      <td className="py-2.5 px-4 text-primary font-semibold">
                        {formatMs(solve.timeMs)}
                      </td>
                      <td className="py-2.5 px-4 text-muted font-sans truncate max-w-xs" title={solve.scramble}>
                        {solve.scramble}
                      </td>
                      <td className="py-2.5 px-4 text-primary">{solve.tps} tps</td>
                      <td className="py-2.5 px-4 text-muted font-sans">
                        {new Date(solve.date).toLocaleDateString()} {new Date(solve.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => deleteSolve(solve.id)}
                          className="p-1 rounded-[4px] text-muted hover:text-red-500 hover:bg-surface-hover transition-colors cursor-pointer"
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
