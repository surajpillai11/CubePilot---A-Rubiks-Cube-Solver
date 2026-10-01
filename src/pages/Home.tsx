import React from 'react';
import { Link } from 'react-router-dom';
import { CubeCanvas } from '../three/CubeCanvas';
import { useCubeStore } from '../store/cubeStore';
import {
  ArrowRight,
  Wand2,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { applyScramble, applyManualMove, isAnimating } = useCubeStore();

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 gap-16">
      {/* Hero Section: Left-aligned, Asymmetric Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Specific Tool Copy & Primary Actions */}
        <div className="lg:col-span-6 flex flex-col gap-5 text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted px-2 py-0.5 rounded-[4px] bg-surface border border-subtle shadow-2xs">
              CubePilot v2.0 · 3D Solver & Engine
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary tracking-tight leading-[1.12]">
              Rubik's cube solver with physical 3D demonstrations.
            </h1>
            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-lg mt-1">
              Enter your physical cube configuration. CubePilot computes the optimal move sequence
              and demonstrates every turn layer-by-layer on an interactive 3D model.
            </p>
          </div>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Link
              to="/input"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:opacity-90 active:scale-98 text-white font-medium text-xs rounded-[6px] transition-all shadow-xs"
            >
              <span>Enter your cube</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/timer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-surface-hover text-primary border border-subtle text-xs font-medium rounded-[6px] transition-colors shadow-2xs cursor-pointer"
            >
              <span>Speed timer</span>
            </Link>

            <Link
              to="/learn"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-muted hover:text-primary text-xs font-medium transition-colors"
            >
              <span>Notation guide</span>
            </Link>
          </div>

          {/* Tool Capabilities Table */}
          <div className="pt-4 border-t border-subtle flex flex-col gap-2 text-xs">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
              Core Capabilities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted">
              <div className="flex items-center gap-2 p-2 bg-surface border border-subtle rounded-[4px] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                <span className="text-primary font-medium">Kociemba Two-Phase</span>
                <span className="font-mono text-[10px] ml-auto text-muted">~20 moves</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-surface border border-subtle rounded-[4px] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                <span className="text-primary font-medium">Auto-Alignment</span>
                <span className="font-mono text-[10px] ml-auto text-muted">24 angles</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-surface border border-subtle rounded-[4px] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                <span className="text-primary font-medium">Physical Layer Turns</span>
                <span className="font-mono text-[10px] ml-auto text-muted">WebGL</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-surface border border-subtle rounded-[4px] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                <span className="text-primary font-medium">WCA Speed Timer</span>
                <span className="font-mono text-[10px] ml-auto text-muted">Ao5 / Ao12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Model & Live Controls */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="relative w-full aspect-square max-w-[460px] mx-auto bg-surface border border-subtle rounded-[6px] p-3 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-subtle text-xs">
              <span className="font-medium text-primary">3D Model Viewport</span>
              <span className="font-mono text-[11px] text-muted">Drag to rotate cube</span>
            </div>

            <div className="w-full flex-1 min-h-[300px] overflow-hidden">
              <CubeCanvas autoRotate={false} highlightActiveFace={true} />
            </div>

            {/* Quick interactive turn bar */}
            <div className="flex items-center justify-between pt-2 border-t border-subtle">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted">Test turns:</span>
                <button
                  onClick={() => applyManualMove('R')}
                  disabled={isAnimating}
                  className="px-2 py-0.5 bg-surface-hover hover:opacity-85 text-primary border border-subtle rounded-[4px] font-mono text-xs cursor-pointer active:scale-90 transition-all"
                  title="Turn R face"
                >
                  R
                </button>
                <button
                  onClick={() => applyManualMove("U'")}
                  disabled={isAnimating}
                  className="px-2 py-0.5 bg-surface-hover hover:opacity-85 text-primary border border-subtle rounded-[4px] font-mono text-xs cursor-pointer active:scale-90 transition-all"
                  title="Turn U' face"
                >
                  U'
                </button>
                <button
                  onClick={() => applyManualMove('F')}
                  disabled={isAnimating}
                  className="px-2 py-0.5 bg-surface-hover hover:opacity-85 text-primary border border-subtle rounded-[4px] font-mono text-xs cursor-pointer active:scale-90 transition-all"
                  title="Turn F face"
                >
                  F
                </button>
              </div>

              <button
                onClick={() => applyScramble()}
                disabled={isAnimating}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-hover hover:opacity-85 text-muted hover:text-primary border border-subtle rounded-[4px] text-xs cursor-pointer active:scale-95 transition-all"
              >
                <Wand2 className="w-3 h-3 text-accent" />
                <span>Scramble</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section: Clean 3-step procedural guide */}
      <section className="border-t border-subtle pt-10 flex flex-col gap-6 text-left">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
            Workflow
          </span>
          <h2 className="text-xl font-semibold text-primary tracking-tight">
            How solving works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-surface border border-subtle rounded-[6px] flex flex-col gap-2 shadow-2xs hover:border-strong transition-colors">
            <span className="font-mono text-muted text-[11px]">01</span>
            <span className="font-semibold text-sm text-primary">Enter configuration</span>
            <p className="text-muted leading-relaxed">
              Input colors into the 2D unfolded net or paint directly onto the 3D model. Centers are anchored to preserve orientation.
            </p>
          </div>

          <div className="p-4 bg-surface border border-subtle rounded-[6px] flex flex-col gap-2 shadow-2xs hover:border-strong transition-colors">
            <span className="font-mono text-muted text-[11px]">02</span>
            <span className="font-semibold text-sm text-primary">Validation & auto-alignment</span>
            <p className="text-muted leading-relaxed">
              CubePilot checks physical piece parity, edge flips, and tests all 24 spatial angles to automatically resolve any viewing tilt.
            </p>
          </div>

          <div className="p-4 bg-surface border border-subtle rounded-[6px] flex flex-col gap-2 shadow-2xs hover:border-strong transition-colors">
            <span className="font-mono text-muted text-[11px]">03</span>
            <span className="font-semibold text-sm text-primary">Follow 3D solution</span>
            <p className="text-muted leading-relaxed">
              The Two-Phase engine delivers an optimal solution in milliseconds with autoplay, step scrubbing, and hand position tips.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
