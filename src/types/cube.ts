export type FaceKey = 'U' | 'L' | 'F' | 'R' | 'B' | 'D';

export type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'green' | 'blue' | 'empty';

export interface ColorDefinition {
  id: CubeColor;
  name: string;
  face: FaceKey;
  hex: string;
  borderHex: string;
  textColor: string;
}

export const CUBE_COLORS: Record<CubeColor, ColorDefinition> = {
  white: {
    id: 'white',
    name: 'White',
    face: 'U',
    hex: '#F8FAFC',
    borderHex: '#CBD5E1',
    textColor: '#0F172A',
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow',
    face: 'D',
    hex: '#FACC15',
    borderHex: '#CA8A04',
    textColor: '#713F12',
  },
  red: {
    id: 'red',
    name: 'Red',
    face: 'R',
    hex: '#EF4444',
    borderHex: '#B91C1C',
    textColor: '#FFFFFF',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    face: 'L',
    hex: '#F97316',
    borderHex: '#C2410C',
    textColor: '#FFFFFF',
  },
  green: {
    id: 'green',
    name: 'Green',
    face: 'F',
    hex: '#22C55E',
    borderHex: '#15803D',
    textColor: '#FFFFFF',
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    face: 'B',
    hex: '#3B82F6',
    borderHex: '#1D4ED8',
    textColor: '#FFFFFF',
  },
  empty: {
    id: 'empty',
    name: 'Blank',
    face: 'U',
    hex: '#1e293b',
    borderHex: '#475569',
    textColor: '#94A3B8',
  },
};

export const DEFAULT_FACE_COLORS: Record<FaceKey, CubeColor> = {
  U: 'white',
  L: 'orange',
  F: 'green',
  R: 'red',
  B: 'blue',
  D: 'yellow',
};

export type FaceStickers = CubeColor[]; // 9 stickers: 0..8

export type CubeFaceGrid = Record<FaceKey, FaceStickers>;

export type StandardMove =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2';

export interface MoveExplanation {
  move: StandardMove;
  face: FaceKey;
  faceName: string;
  directionName: string;
  rotationAngleDeg: number;
  rotationSymbol: '↻' | '↺' | '⟲';
  shortDescription: string;
  beginnerInstruction: string;
  relativeTurnTips: string;
}

export interface ValidationResult {
  isValid: boolean;
  isComplete: boolean;
  emptyCount: number;
  colorCounts: Record<CubeColor, number>;
  errorMessage?: string;
  errorTitle?: string;
  suggestedFix?: string;
  canAutoFix?: boolean;
  highlightedStickers?: Array<{ face: FaceKey; index: number }>;
}

export interface SolutionStep {
  index: number;
  move: StandardMove;
  explanation: MoveExplanation;
  phase?: 'cross' | 'f2l' | 'oll' | 'pll' | 'kociemba';
}

export interface Solution {
  moves: StandardMove[];
  steps: SolutionStep[];
  moveCount: number;
  estimatedSolveTimeMs?: number;
  algorithmString: string;
  repairedCube?: CubeFaceGrid;
}

export interface SolveRecord {
  id: string;
  date: string;
  timeMs: number;
  moves: number;
  tps: number;
  scramble: string;
}
