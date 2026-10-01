import React from 'react';
import { Box } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/90 py-8 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Box className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-300">
            CubePilot — 3D Rubik's Cube Solver & Interactive Tutor
          </span>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <Link to="/input" className="hover:text-slate-200 transition-colors">
            Solver
          </Link>
          <Link to="/timer" className="hover:text-slate-200 transition-colors">
            Speed Timer
          </Link>
          <Link to="/learn" className="hover:text-slate-200 transition-colors">
            Algorithms & Notation
          </Link>
          <Link to="/stats" className="hover:text-slate-200 transition-colors">
            Statistics
          </Link>
        </div>

        {/* Note */}
        <div className="text-[11px] text-slate-500 font-mono">
          Kociemba Two-Phase Engine • WCA Standard
        </div>
      </div>
    </footer>
  );
};
