import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-subtle bg-page py-6 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary tracking-tight">
            CubePilot
          </span>
          <span className="text-xs text-muted">
            — 3D Rubik's cube solver & speedcubing tool
          </span>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-4 text-xs text-muted">
          <Link to="/input" className="hover:text-primary transition-colors">
            Color input
          </Link>
          <Link to="/timer" className="hover:text-primary transition-colors">
            Timer
          </Link>
          <Link to="/learn" className="hover:text-primary transition-colors">
            Notation reference
          </Link>
          <Link to="/stats" className="hover:text-primary transition-colors">
            Statistics
          </Link>
        </div>

        {/* Note */}
        <div className="text-[11px] text-muted font-mono">
          Two-phase solver • Singmaster notation
        </div>
      </div>
    </footer>
  );
};
