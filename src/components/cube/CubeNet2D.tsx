import React from 'react';
import { CubeColor, CUBE_COLORS, DEFAULT_FACE_COLORS, FaceKey } from '../../types/cube';
import { useCubeStore } from '../../store/cubeStore';
import { RotateCcw, Plus, Lock } from 'lucide-react';

interface FaceGridProps {
  face: FaceKey;
  label: string;
}

const FACE_ORIENTATION_HINTS: Record<FaceKey, { top: string; bottom: string; left: string; right: string }> = {
  U: { top: 'Back (Blue)', bottom: 'Front (Green)', left: 'Orange', right: 'Red' },
  F: { top: 'Top (White)', bottom: 'Bottom (Yellow)', left: 'Orange', right: 'Red' },
  R: { top: 'Top (White)', bottom: 'Bottom (Yellow)', left: 'Green', right: 'Blue' },
  L: { top: 'Top (White)', bottom: 'Bottom (Yellow)', left: 'Blue', right: 'Green' },
  B: { top: 'Top (White)', bottom: 'Bottom (Yellow)', left: 'Red', right: 'Orange' },
  D: { top: 'Front (Green)', bottom: 'Back (Blue)', left: 'Orange', right: 'Red' },
};

const FaceGrid: React.FC<FaceGridProps> = ({ face, label }) => {
  const { cubeState, setSticker, activeColor, resetFace } = useCubeStore();
  const stickers = cubeState[face];
  const centerColor = stickers[4];
  const centerDef = CUBE_COLORS[centerColor] || CUBE_COLORS[DEFAULT_FACE_COLORS[face]];
  const activeColorDef = CUBE_COLORS[activeColor];
  const hints = FACE_ORIENTATION_HINTS[face];

  return (
    <div className="flex flex-col items-center bg-slate-900/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-md">
      {/* Face Header with Center Color Badge */}
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-xs"
            style={{ backgroundColor: centerDef.hex }}
            title={`Center color: ${centerDef.name}`}
          />
          <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
            {label} ({face})
          </span>
        </div>
        <button
          onClick={() => resetFace(face)}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
          title={`Clear ${label} face stickers to blank`}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Top Edge Indicator */}
      <div className="text-[9px] font-mono text-slate-400/80 mb-1 flex items-center gap-0.5 tracking-tight">
        <span>↑</span>
        <span>{hints.top}</span>
      </div>

      {/* 3x3 Sticker Grid with Left/Right guides */}
      <div className="flex items-center gap-1">
        <span className="text-[8px] font-mono text-slate-500 uppercase -rotate-90 w-2 text-center" title={`Left edge: ${hints.left}`}>
          {hints.left.slice(0, 3)}
        </span>

        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-xl border border-white/10 shadow-inner">
          {stickers.map((color, index) => {
            const isCenter = index === 4;
            const isBlank = color === 'empty';
            const colorDef = CUBE_COLORS[color];

            return (
              <button
                key={`${face}-${index}`}
                onClick={() => {
                  if (isCenter) return; // Keep center anchored as reference
                  setSticker(face, index, activeColor);
                }}
                className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center cursor-pointer group ${
                  isBlank
                    ? 'bg-slate-900/90 border border-dashed border-slate-600 hover:border-blue-400 hover:bg-slate-850'
                    : 'border border-black/40'
                }`}
                style={{
                  backgroundColor: isBlank ? undefined : colorDef.hex,
                }}
                title={
                  isCenter
                    ? `${label} Center (${colorDef.name}) - Fixed Reference Anchor`
                    : `${label} sticker ${index + 1}: ${isBlank ? 'Blank (Click to paint)' : colorDef.name}`
                }
              >
                {/* Plus icon on blank stickers */}
                {isBlank && (
                  <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-300 transition-colors" />
                )}

                {/* Center piece indicator with lock icon */}
                {isCenter && (
                  <div
                    className="flex items-center justify-center p-0.5 rounded-full opacity-80"
                    title="Fixed Center (Anchors this face)"
                  >
                    <Lock className="w-2.5 h-2.5" style={{ color: colorDef.textColor }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <span className="text-[8px] font-mono text-slate-500 uppercase rotate-90 w-2 text-center" title={`Right edge: ${hints.right}`}>
          {hints.right.slice(0, 3)}
        </span>
      </div>

      {/* Bottom Edge Indicator */}
      <div className="text-[9px] font-mono text-slate-400/80 mt-1 flex items-center gap-0.5 tracking-tight">
        <span>↓</span>
        <span>{hints.bottom}</span>
      </div>
    </div>
  );
};

export const CubeNet2D: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none gap-2">
      {/* Top Face: Up (U) - White */}
      <div className="mb-0.5">
        <FaceGrid face="U" label="Top (White)" />
      </div>

      {/* Middle Row: Left (L/Orange), Front (F/Green), Right (R/Red), Back (B/Blue) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-0.5 w-full justify-items-center">
        <FaceGrid face="L" label="Left (Orange)" />
        <FaceGrid face="F" label="Front (Green)" />
        <FaceGrid face="R" label="Right (Red)" />
        <FaceGrid face="B" label="Back (Blue)" />
      </div>

      {/* Bottom Face: Down (D) - Yellow */}
      <div>
        <FaceGrid face="D" label="Bottom (Yellow)" />
      </div>
    </div>
  );
};
