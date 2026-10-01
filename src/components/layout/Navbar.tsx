import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCubeStore } from '../../store/cubeStore';
import { CubeMicroSpinner } from '../common/CubeMicroSpinner';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme, soundEnabled, setSoundEnabled } = useCubeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/input', label: 'Enter Cube' },
    { to: '/solution', label: 'Solution' },
    { to: '/timer', label: 'Timer' },
    { to: '/learn', label: 'Guide' },
    { to: '/stats', label: 'History' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-page/95 backdrop-blur-xs border-b border-subtle transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          {/* Left: Brand with interactive Micro-Cube Spinner */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group" title="CubePilot — 3D Rubik's Cube Solver">
              <CubeMicroSpinner size={22} className="text-primary group-hover:scale-105 transition-transform" />
              <span className="font-semibold text-sm tracking-tight text-primary">
                CubePilot
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-surface-active text-primary font-semibold'
                        : 'text-muted hover:text-primary hover:bg-surface-hover'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Controls & Primary Action */}
          <div className="flex items-center gap-1.5">
            {/* Keyboard Shortcuts */}
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary hover:bg-surface-hover rounded-[6px] border border-subtle transition-colors hidden sm:flex cursor-pointer"
              title="Keyboard shortcuts"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary hover:bg-surface-hover rounded-[6px] border border-subtle transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute audio' : 'Enable audio'}
              aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-primary" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-dim" />
              )}
            </button>

            {/* Theme Toggle: Smooth transition between Dark and Light mode */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary hover:bg-surface-hover rounded-[6px] border border-subtle transition-all duration-200 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-primary hover:rotate-45 transition-transform duration-200" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-primary hover:-rotate-12 transition-transform duration-200" />
              )}
            </button>

            {/* Single Accent Primary Action */}
            <Link
              to="/input"
              className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-accent hover:opacity-90 rounded-[6px] transition-all ml-1 active:scale-98"
            >
              Enter cube
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary rounded-[6px] md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-subtle bg-page px-4 py-2 flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-surface-active text-primary font-semibold'
                    : 'text-muted hover:bg-surface-hover hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/input"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-1.5 text-xs font-medium text-white bg-accent rounded-[6px]"
            >
              Enter cube
            </Link>
          </div>
        )}
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="w-full max-w-xs bg-surface border border-subtle rounded-[8px] p-4 flex flex-col gap-3 shadow-lg text-primary animate-move-slide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-subtle pb-2">
              <span className="text-xs font-semibold text-primary">Keyboard shortcuts</span>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-muted hover:text-primary cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted">Play / Pause</span>
                <kbd className="px-1.5 py-0.5 bg-surface-hover border border-subtle rounded-[4px] font-mono text-[11px] text-primary">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted">Next step</span>
                <kbd className="px-1.5 py-0.5 bg-surface-hover border border-subtle rounded-[4px] font-mono text-[11px] text-primary">
                  →
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted">Previous step</span>
                <kbd className="px-1.5 py-0.5 bg-surface-hover border border-subtle rounded-[4px] font-mono text-[11px] text-primary">
                  ←
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted">Restart</span>
                <kbd className="px-1.5 py-0.5 bg-surface-hover border border-subtle rounded-[4px] font-mono text-[11px] text-primary">
                  R
                </kbd>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted">Timer start / stop</span>
                <kbd className="px-1.5 py-0.5 bg-surface-hover border border-subtle rounded-[4px] font-mono text-[11px] text-primary">
                  Hold Space
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
