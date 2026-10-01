import React, { useState } from 'react';
import { useCubeStore } from '../store/cubeStore';
import { useNavigate } from 'react-router-dom';
import { CubeCanvas } from '../three/CubeCanvas';
import { parseMoveString } from '../cube/notation';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCw,
  Compass,
  Play,
  CheckCircle,
} from 'lucide-react';

interface AlgorithmItem {
  id: string;
  name: string;
  moves: string;
  category: 'Trigger' | 'OLL' | 'PLL';
  description: string;
  tips: string;
}

const ALGORITHMS: AlgorithmItem[] = [
  {
    id: 'sexy_move',
    name: 'The "Sexy Move"',
    moves: "R U R' U'",
    category: 'Trigger',
    description: 'The fundamental 4-move building block used in countless algorithms.',
    tips: 'Right side up, top to the left, right side down, top to the right.',
  },
  {
    id: 'reverse_sexy',
    name: 'Reverse Sexy Move',
    moves: "U R U' R'",
    category: 'Trigger',
    description: 'Used for inserting corner/edge pairs in first and second layers.',
    tips: 'Top to the left, right side up, top to the right, right side down.',
  },
  {
    id: 'sune',
    name: 'Sune (OLL 27)',
    moves: "R U R' U R U2 R'",
    category: 'OLL',
    description: 'Orientates top yellow corners while preserving bottom two layers.',
    tips: 'Up, push, down, push, up, push twice, down.',
  },
  {
    id: 'antisune',
    name: 'Anti-Sune (OLL 26)',
    moves: "R U2 R' U' R U' R'",
    category: 'OLL',
    description: 'Mirror of the Sune algorithm for opposite corner orientation.',
    tips: 'Notice the double turn is on the first top turn.',
  },
  {
    id: 't_perm',
    name: 'T-Perm (PLL)',
    moves: "R U R' U' R' F R2 U' R' U' R U R' F'",
    category: 'PLL',
    description: 'Swaps two adjacent corners and two adjacent edges in the last layer.',
    tips: 'Starts with Sexy Move, then transitions to an F turn and R2.',
  },
  {
    id: 'j_perm',
    name: 'J-Perm (PLL)',
    moves: "R U R' F' R U R' U' R' F R2 U' R'",
    category: 'PLL',
    description: 'Swaps two adjacent corners and two opposite edges.',
    tips: 'One of the fastest speedcubing algorithms to execute.',
  },
];

export const Learn: React.FC = () => {
  const navigate = useNavigate();
  const { applyManualMove, isAnimating, resetCube } = useCubeStore();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmItem>(ALGORITHMS[0]);

  const handleTestAlgorithm = (algo: AlgorithmItem) => {
    setSelectedAlgo(algo);
    resetCube();
    const moves = parseMoveString(algo.moves);
    // Apply moves sequentially with visual delay
    moves.forEach((m, idx) => {
      setTimeout(() => {
        applyManualMove(m);
      }, idx * 450);
    });
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Learn How to Solve the Rubik's Cube
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          From cube anatomy and standard Singmaster notation to the Layer-by-Layer (CFOP) method
          and essential speedcubing algorithms with interactive 3D demonstrations.
        </p>
      </div>

      {/* Section 1: Cube Anatomy & Notation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Anatomy & Pieces */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span>The 3 Types of Pieces</span>
          </h2>

          <div className="flex flex-col gap-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
              <span className="font-bold text-blue-400 text-sm block mb-1">
                1. Centers (6 pieces, 1 color each)
              </span>
              <p className="text-slate-400 leading-relaxed">
                Centers are fixed relative to each other on the internal core. They never change
                places! The center sticker on each face defines the color of that entire solved face.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
              <span className="font-bold text-emerald-400 text-sm block mb-1">
                2. Edges (12 pieces, 2 colors each)
              </span>
              <p className="text-slate-400 leading-relaxed">
                Edges are located between two centers. An edge piece always has exactly two colors
                and can only move between edge slots.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
              <span className="font-bold text-purple-400 text-sm block mb-1">
                3. Corners (8 pieces, 3 colors each)
              </span>
              <p className="text-slate-400 leading-relaxed">
                Corners sit at the eight vertices of the cube. Each corner piece has three colors
                and moves only between corner positions.
              </p>
            </div>
          </div>
        </div>

        {/* Notation Reference */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-indigo-400" />
            <span>Move Notation Guide</span>
          </h2>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="font-mono font-bold text-white text-sm">R / L</span>
              <p className="text-[11px] text-slate-400 mt-1">Right / Left faces 90° clockwise</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="font-mono font-bold text-white text-sm">U / D</span>
              <p className="text-[11px] text-slate-400 mt-1">Up (Top) / Down (Bottom) faces 90°</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="font-mono font-bold text-white text-sm">F / B</span>
              <p className="text-[11px] text-slate-400 mt-1">Front / Back faces 90° clockwise</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="font-mono font-bold text-blue-400 text-sm">' (Prime)</span>
              <p className="text-[11px] text-slate-400 mt-1">Counter-clockwise quarter turn (90°)</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 col-span-2">
              <span className="font-mono font-bold text-amber-400 text-sm">2 (Double Turn)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Turn that layer 180° (two quarter turns in either direction). Example: <code>R2</code>, <code>U2</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Algorithms Showcase */}
      <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
              Speedcubing & CFOP Essentials
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Key Algorithms with Live 3D Execution
            </h2>
          </div>
          <button
            onClick={() => resetCube()}
            className="w-fit text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300"
          >
            Reset 3D Cube
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Algorithm list */}
          <div className="lg:col-span-6 flex flex-col gap-2.5">
            {ALGORITHMS.map((algo) => {
              const isSelected = selectedAlgo.id === algo.id;
              return (
                <div
                  key={algo.id}
                  onClick={() => setSelectedAlgo(algo)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/40 shadow-lg'
                      : 'bg-slate-950/40 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{algo.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {algo.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestAlgorithm(algo);
                      }}
                      disabled={isAnimating}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                      title="Run this algorithm on the 3D cube"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play 3D</span>
                    </button>
                  </div>

                  <div className="font-mono font-bold text-xs text-blue-300 bg-slate-900/80 px-2 py-1 rounded-lg border border-white/5 w-fit">
                    {algo.moves}
                  </div>

                  <p className="text-xs text-slate-400">{algo.description}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive 3D Cube Canvas Demonstration */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full aspect-square max-w-[420px] rounded-3xl bg-slate-950/80 border border-white/10 p-2 shadow-2xl overflow-hidden">
              <CubeCanvas autoRotate={false} highlightActiveFace={true} />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-slate-400 font-mono">
                Currently demonstrating: <strong className="text-white">{selectedAlgo.name}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
