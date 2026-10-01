import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-4 py-24 text-center gap-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
        <Box className="w-8 h-8" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">
          404 Error
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          The cube piece you're looking for seems to have been rotated into another dimension.
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/25 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
