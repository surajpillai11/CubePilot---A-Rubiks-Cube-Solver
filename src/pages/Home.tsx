import React from 'react';
import { Link } from 'react-router-dom';
import { CubeCanvas } from '../three/CubeCanvas';
import { useCubeStore } from '../store/cubeStore';
import { PRESET_PATTERNS } from '../cube/CubeState';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  BookOpen,
  Timer,
  BarChart2,
  Wand2,
  RotateCw,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { applyPreset, applyScramble, applyManualMove, isAnimating } = useCubeStore();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Subtle background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen 3D Solver & Personal Tutor</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">
                Master Your Cube
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Solve it.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Understand it.
                </span>{' '}
                Master it.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              An interactive 3D Rubik's Cube solver that doesn't just give you raw notation — it
              physically rotates every layer and guides you move-by-move like a personal coach.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/input"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 active:scale-95 transition-all"
              >
                <span>Solve My Cube</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/learn"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 font-semibold text-sm transition-all"
              >
                <span>How It Works</span>
              </Link>

              <Link
                to="/timer"
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-white font-medium text-xs transition-colors"
              >
                <Timer className="w-4 h-4 text-blue-400" />
                <span>Speed Timer</span>
              </Link>
            </div>

            {/* Quick Interactive Sandbox on Hero */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Quick Interactive Demo
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => applyScramble()}
                  disabled={isAnimating}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Random Scramble</span>
                </button>

                {PRESET_PATTERNS.slice(0, 2).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    disabled={isAnimating}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}

                <button
                  onClick={() => applyManualMove('R')}
                  disabled={isAnimating}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-mono font-bold text-blue-300 transition-colors"
                  title="Turn R face clockwise"
                >
                  Turn R ↻
                </button>
                <button
                  onClick={() => applyManualMove("U'")}
                  disabled={isAnimating}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-mono font-bold text-blue-300 transition-colors"
                  title="Turn U face counter-clockwise"
                >
                  Turn U' ↺
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Rubik's Cube Canvas */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[500px] rounded-3xl bg-slate-900/40 border border-white/10 shadow-2xl p-2 backdrop-blur-xl">
              <CubeCanvas autoRotate={false} highlightActiveFace={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-bold">
              Complete Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Built for Beginners, Speedcubers & Enthusiasts
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Everything you need to solve your physical cube, improve your times, and master CFOP notation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">54 Stickers Net</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your cube effortlessly with our unfolded 2D net. Pick vibrant standard colors
                or auto-fill centers with a single click.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Cube Validation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time checks verify piece counts, corner twists, edge flips, and permutation parity
                with clear, human-friendly diagnostic advice.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Genuine 3D Animation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No flat images or fake CSS transitions. All 9 cubies in the target layer physically
                rotate smoothly with directional arrows and glow.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Step-by-Step Guidance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Always know what to do next. Beginner mode provides plain English instructions,
                hand-position tips, and directional turn previews.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Speedcubing Timer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spacebar hold-to-start competition timer with WCA scrambles, turns-per-second (TPS)
                tracking, and average of 5 / 12 statistics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Solve History & Stats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track your personal bests, solve consistency, and average moves over time with
                clean, distraction-free performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-bold">
              The Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              From Scrambled to Solved in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 relative overflow-hidden">
              <span className="font-mono text-3xl font-black text-blue-500/30">01</span>
              <h3 className="text-base font-bold text-white">Enter Your Cube</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select colors and tap the stickers on the 2D unfolded net matching your physical cube.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 relative overflow-hidden">
              <span className="font-mono text-3xl font-black text-emerald-500/30">02</span>
              <h3 className="text-base font-bold text-white">Validate Configuration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time mathematical analysis detects impossible states or single twisted corners.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 relative overflow-hidden">
              <span className="font-mono text-3xl font-black text-indigo-500/30">03</span>
              <h3 className="text-base font-bold text-white">Generate Solution</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kociemba Two-Phase algorithm computes an optimal ~20-move solution in milliseconds.
              </p>
            </div>

            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-white/10 relative overflow-hidden">
              <span className="font-mono text-3xl font-black text-purple-500/30">04</span>
              <h3 className="text-base font-bold text-white">Watch & Solve</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Follow along with smooth 3D animations, speed controls, and step-by-step instructions.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Link
              to="/input"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 active:scale-95 transition-all"
            >
              <span>Get Started Now</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
