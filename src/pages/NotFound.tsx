import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-start justify-center max-w-md mx-auto px-4 py-24 gap-4">
      <div className="p-6 rounded-[6px] bg-surface border border-subtle w-full flex flex-col gap-3">
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider">
          404 Not Found
        </div>
        <h1 className="text-xl font-semibold text-primary tracking-tight">
          Page does not exist
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          The requested URL could not be resolved. Check the address or return to the overview.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-accent hover:opacity-90 text-white font-medium text-xs transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
