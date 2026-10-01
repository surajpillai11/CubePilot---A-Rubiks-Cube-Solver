import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCubeStore } from '../../store/cubeStore';
import {
  Box,
  Compass,
  Timer,
  BookOpen,
  BarChart3,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme, soundEnabled, setSoundEnabled } = useCubeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/input', label: 'Enter Cube' },
    { to: '/solution', label: '3D Solution' },
    { to: '/timer', label: 'Speed Timer' },
    { to: '/learn', label: 'Learn' },
    { to: '/stats', label: 'Statistics' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1">
                CubePilot
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono">
                3D SOLVER & TUTOR
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1.5">
            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition-colors hidden sm:flex items-center justify-center"
              title="Keyboard Shortcuts"
              aria-label="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition-colors"
              title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
              aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/5 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* CTA Button */}
            <Link
              to="/input"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all ml-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solve My Cube</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-xl md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-blue-400" />
                <span>Keyboard Shortcuts</span>
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Play / Pause Solution</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/15 rounded font-mono text-slate-200">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Next Solution Step</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/15 rounded font-mono text-slate-200">
                  → (Right)
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Previous Solution Step</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/15 rounded font-mono text-slate-200">
                  ← (Left)
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-300">Restart to Step 1</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/15 rounded font-mono text-slate-200">
                  R
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300">Timer Start / Stop</span>
                <kbd className="px-2 py-1 bg-slate-800 border border-white/15 rounded font-mono text-slate-200">
                  Hold Space
                </kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
