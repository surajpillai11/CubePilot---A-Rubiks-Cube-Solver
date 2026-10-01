import React from 'react';
import { CubeColor, CUBE_COLORS, DEFAULT_FACE_COLORS, FaceKey } from '../../types/cube';
import { useCubeStore } from '../../store/cubeStore';
import { RotateCcw, Lock } from 'lucide-react';

interface FaceGridProps {
  face: FaceKey;
  label: string;
}

const FACE_HINTS: Record<FaceKey, { top: string; bottom: string }> = {
  U: { top: 'Back (B)', bottom: 'Front (F)' },
  F: { top: 'Top (U)', bottom: 'Bottom (D)' },
  R: { top: 'Top (U)', bottom: 'Bottom (D)' },
  L: { top: 'Top (U)', bottom: 'Bottom (D)' },
  B: { top: 'Top (U)', bottom: 'Bottom (D)' },
  D: { top: 'Front (F)', bottom: 'Back (B)' },
};

const FaceGrid: React.FC<FaceGridProps> = ({ face, label }) => {
  const { cubeState, setSticker, activeColor, resetFace } = useCubeStore();
  const stickers = cubeState[face];
  const centerColor = stickers[4];
  const centerDef = CUBE_COLORS[centerColor] || CUBE_COLORS[DEFAULT_FACE_COLORS[face]];
  const hints = FACE_HINTS[face];

  return (
    <div className="flex flex-col items-center bg-surface p-2.5 rounded-[6px] border border-subtle w-full transition-colors duration-200 shadow-2xs">
      {/* Face Header */}
      <div className="flex items-center justify-between w-full mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-[2px] border border-subtle shrink-0 shadow-2xs"
            style={{ backgroundColor: centerDef.hex }}
            title={`Center color: ${centerDef.name}`}
          />
          <span className="text-[11px] font-medium text-primary tracking-tight">
            {label} <span className="text-muted font-mono">({face})</span>
          </span>
        </div>
        <button
          onClick={() => resetFace(face)}
          className="text-muted hover:text-primary p-1 rounded-[4px] hover:bg-surface-hover transition-colors cursor-pointer"
          title={`Reset ${label} face`}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Top neighbor indicator */}
      <span className="text-[9px] font-mono text-dim mb-1">
        ↑ {hints.top}
      </span>

      {/* 3x3 Sticker Grid */}
      <div className="grid grid-cols-3 gap-1 bg-page p-1 rounded-[4px] border border-subtle transition-colors duration-200">
        {stickers.map((color, index) => {
          const isCenter = index === 4;
          const isBlank = color === 'empty';
          const colorDef = CUBE_COLORS[color];

          return (
            <button
              key={`${face}-${index}`}
              onClick={() => {
                if (isCenter) return;
                setSticker(face, index, activeColor);
              }}
              className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] transition-all duration-150 flex items-center justify-center cursor-pointer select-none ${
                isCenter ? 'cursor-default' : 'active:scale-88 hover:scale-104 hover:z-10'
              } ${
                isBlank
                  ? 'bg-surface-hover border border-dashed border-strong hover:border-muted'
                  : 'border border-black/20 shadow-2xs'
              }`}
              style={{
                backgroundColor: isBlank ? undefined : colorDef.hex,
              }}
              title={
                isCenter
                  ? `${label} Center (${colorDef.name}) · Fixed Reference`
                  : `${label} sticker ${index + 1}: ${isBlank ? 'Blank (Click to paint)' : colorDef.name}`
              }
            >
              {/* Center piece fixed indicator */}
              {isCenter && (
                <Lock className="w-2.5 h-2.5 opacity-60" style={{ color: colorDef.textColor }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom neighbor indicator */}
      <span className="text-[9px] font-mono text-dim mt-1">
        ↓ {hints.bottom}
      </span>
    </div>
  );
};

export const CubeNet2D: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      {/* 
        Strict 4-Column Cube Net:
        Col 1: Left (Orange)
        Col 2: Top (U, Row 1) -> Front (F, Row 2) -> Bottom (D, Row 3)
        Col 3: Right (Red)
        Col 4: Back (Blue)
        This guarantees Top, Front, and Bottom share the exact same column,
        and Left, Front, Right, Back are horizontally aligned edge-to-edge.
      */}
      <div className="grid grid-cols-4 grid-rows-3 gap-2 min-w-[540px] max-w-[640px] mx-auto select-none items-start">
        {/* Row 1: Top in Column 2 */}
        <div className="col-start-2 row-start-1">
          <FaceGrid face="U" label="Top" />
        </div>

        {/* Row 2: Left, Front, Right, Back completely aligned horizontally */}
        <div className="col-start-1 row-start-2">
          <FaceGrid face="L" label="Left" />
        </div>
        <div className="col-start-2 row-start-2">
          <FaceGrid face="F" label="Front" />
        </div>
        <div className="col-start-3 row-start-2">
          <FaceGrid face="R" label="Right" />
        </div>
        <div className="col-start-4 row-start-2">
          <FaceGrid face="B" label="Back" />
        </div>

        {/* Row 3: Bottom in Column 2 */}
        <div className="col-start-2 row-start-3">
          <FaceGrid face="D" label="Bottom" />
        </div>
      </div>
    </div>
  );
};
