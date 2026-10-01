import React, { useState } from 'react';
import { useCubeStore } from '../store/cubeStore';
import { CubeCanvas } from '../three/CubeCanvas';
import { parseMoveString } from '../cube/notation';
import {
  Play,
  RotateCcw,
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
    description: 'Fundamental 4-move building block used in first-layer insertion and CFOP.',
    tips: 'Right face up, top face left, right face down, top face right.',
  },
  {
    id: 'reverse_sexy',
    name: 'Reverse Sexy Move',
    moves: "U R U' R'",
    category: 'Trigger',
    description: 'Used for inserting corner/edge pairs in F2L.',
    tips: 'Top face left, right face up, top face right, right face down.',
  },
  {
    id: 'sune',
    name: 'Sune (OLL 27)',
    moves: "R U R' U R U2 R'",
    category: 'OLL',
    description: 'Orients top yellow corners while preserving bottom two layers.',
    tips: 'Up, push, down, push, up, push twice, down.',
  },
  {
    id: 'antisune',
    name: 'Anti-Sune (OLL 26)',
    moves: "R U2 R' U' R U' R'",
    category: 'OLL',
    description: 'Mirror of the Sune algorithm for opposite corner orientation.',
    tips: 'Notice the double turn occurs on the first top turn.',
  },
  {
    id: 't_perm',
    name: 'T-Perm (PLL)',
    moves: "R U R' U' R' F R2 U' R' U' R U R' F'",
    category: 'PLL',
    description: 'Swaps two adjacent corners and two adjacent edges in the last layer.',
    tips: 'Sexy move sequence transitions into an F turn and R2.',
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

const NOTATION_REFERENCE = [
  { move: 'R', name: 'Right', desc: 'Clockwise 90° turn of the right face' },
  { move: "R'", name: 'Right Prime', desc: 'Counter-clockwise 90° turn of the right face' },
  { move: 'R2', name: 'Right Double', desc: '180° turn of the right face' },
  { move: 'U', name: 'Up (Top)', desc: 'Clockwise 90° turn of the top face' },
  { move: "U'", name: 'Up Prime', desc: 'Counter-clockwise 90° turn of the top face' },
  { move: 'F', name: 'Front', desc: 'Clockwise 90° turn of the front face' },
  { move: "F'", name: 'Front Prime', desc: 'Counter-clockwise 90° turn of the front face' },
  { move: 'L', name: 'Left', desc: 'Clockwise 90° turn of the left face' },
  { move: 'D', name: 'Down (Bottom)', desc: 'Clockwise 90° turn of the bottom face' },
  { move: 'B', name: 'Back', desc: 'Clockwise 90° turn of the back face' },
];

export const Learn: React.FC = () => {
  const { applyManualMove, resetCube, isAnimating } = useCubeStore();
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmItem>(ALGORITHMS[0]);

  const handleTestAlgorithm = (algo: AlgorithmItem) => {
    setActiveAlgo(algo);
    resetCube();
    const moves = parseMoveString(algo.moves);
    moves.forEach((m, idx) => {
      setTimeout(() => {
        applyManualMove(m);
      }, idx * 400);
    });
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-subtle pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
          Notation & Algorithm Guide
        </h1>
        <p className="text-xs text-muted">
          Standard Singmaster notation, piece mechanics, and common speedcubing algorithms.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Algorithm Manual & Notation Table */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Algorithms Section */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              Core Algorithms
            </span>

            <div className="flex flex-col divide-y divide-subtle bg-surface border border-subtle rounded-[6px] shadow-2xs">
              {ALGORITHMS.map((algo) => (
                <div key={algo.id} className="p-3.5 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{algo.name}</span>
                      <span className="text-[10px] font-mono text-muted bg-page px-1.5 py-0.5 rounded-[3px] border border-subtle">
                        {algo.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleTestAlgorithm(algo)}
                      disabled={isAnimating}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-hover hover:opacity-85 text-primary border border-subtle rounded-[4px] text-[11px] font-medium transition-all cursor-pointer disabled:opacity-40 active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-current text-accent" />
                      <span>Test on 3D cube</span>
                    </button>
                  </div>

                  <span className="font-mono text-xs text-accent bg-page p-2 rounded-[4px] border border-subtle select-all">
                    {algo.moves}
                  </span>

                  <p className="text-muted text-[11px] leading-relaxed">
                    {algo.description} <span className="text-primary ml-1 font-medium">Tip: {algo.tips}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notation Table */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
              Singmaster Notation Reference
            </span>

            <div className="bg-surface border border-subtle rounded-[6px] overflow-hidden text-xs shadow-2xs">
              <div className="grid grid-cols-12 bg-page p-2.5 font-medium text-muted border-b border-subtle">
                <span className="col-span-2 font-mono">Move</span>
                <span className="col-span-4">Face</span>
                <span className="col-span-6">Action</span>
              </div>
              <div className="flex flex-col divide-y divide-subtle">
                {NOTATION_REFERENCE.map((item) => (
                  <div key={item.move} className="grid grid-cols-12 p-2.5 text-muted items-center hover:bg-surface-hover/50 transition-colors">
                    <span className="col-span-2 font-mono font-semibold text-primary">
                      {item.move}
                    </span>
                    <span className="col-span-4 text-primary font-medium">{item.name}</span>
                    <span className="col-span-6 text-[11px]">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Model Viewport */}
        <div className="lg:col-span-5 flex flex-col gap-3 sticky top-16">
          <div className="flex flex-col bg-surface border border-subtle rounded-[6px] p-3 text-xs shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-subtle">
              <span className="font-medium text-primary">Interactive Demo Viewport</span>
              <button
                onClick={resetCube}
                disabled={isAnimating}
                className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-primary cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset cube</span>
              </button>
            </div>

            <div className="w-full aspect-square bg-page rounded-[4px] border border-subtle overflow-hidden">
              <CubeCanvas autoRotate={false} highlightActiveFace={true} />
            </div>

            <div className="pt-2 mt-2 border-t border-subtle flex flex-col gap-1 text-[11px] text-muted">
              <span className="font-medium text-primary">Selected algorithm:</span>
              <span className="font-mono text-accent">{activeAlgo.name} · {activeAlgo.moves}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
