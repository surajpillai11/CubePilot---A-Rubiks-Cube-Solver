import React from 'react';
import { CubeColor, CUBE_COLORS, FaceKey } from '../../types/cube';
import { useCubeStore } from '../../store/cubeStore';
import { RotateCcw } from 'lucide-react';

interface FaceGridProps {
  face: FaceKey;
  label: string;
}

const FaceGrid: React.FC<FaceGridProps> = ({ face, label }) => {
  const { cubeState, setSticker, activeColor, resetFace } = useCubeStore();
  const stickers = cubeState[face];

  return (
    <div className="flex flex-col items-center bg-slate-900/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10 shadow-md">
      {/* Face Header */}
      <div className="flex items-center justify-between w-full mb-1.5 px-0.5">
        <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
          {label} ({face})
        </span>
        <button
          onClick={() => resetFace(face)}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
          title={`Reset ${label} face`}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* 3x3 Sticker Grid */}
      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-white/5 shadow-inner">
        {stickers.map((color, index) => {
          const colorDef = CUBE_COLORS[color];
          const isCenter = index === 4;

          return (
            <button
              key={`${face}-${index}`}
              onClick={() => setSticker(face, index, activeColor)}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-all transform hover:scale-105 active:scale-95 shadow-sm border border-black/20 flex items-center justify-center cursor-pointer group"
              style={{ backgroundColor: colorDef.hex }}
              title={`${label} sticker ${index + 1} (${colorDef.name})${isCenter ? ' — Center Piece' : ''}`}
            >
              {isCenter && (
                <div
                  className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: colorDef.textColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const CubeNet2D: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* Top Face: Up (U) */}
      <div className="mb-2">
        <FaceGrid face="U" label="Top" />
      </div>

      {/* Middle Row: Left (L), Front (F), Right (R), Back (B) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 w-full justify-items-center">
        <FaceGrid face="L" label="Left" />
        <FaceGrid face="F" label="Front" />
        <FaceGrid face="R" label="Right" />
        <FaceGrid face="B" label="Back" />
      </div>

      {/* Bottom Face: Down (D) */}
      <div>
        <FaceGrid face="D" label="Bottom" />
      </div>
    </div>
  );
};
