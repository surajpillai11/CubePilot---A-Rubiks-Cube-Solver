import { CubeColor, CubeFaceGrid, FaceKey, StandardMove } from '../types/cube';

export function createSolvedCube(): CubeFaceGrid {
  return {
    U: Array(9).fill('white'),
    D: Array(9).fill('yellow'),
    L: Array(9).fill('orange'),
    R: Array(9).fill('red'),
    F: Array(9).fill('green'),
    B: Array(9).fill('blue'),
  };
}

export function cloneCube(cube: CubeFaceGrid): CubeFaceGrid {
  return {
    U: [...cube.U],
    D: [...cube.D],
    L: [...cube.L],
    R: [...cube.R],
    F: [...cube.F],
    B: [...cube.B],
  };
}

function rotateFaceCW(face: CubeColor[]): CubeColor[] {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ];
}

function applySingleCW(s: CubeFaceGrid, m: FaceKey): void {
  s[m] = rotateFaceCW(s[m]);
  if (m === 'U') {
    const tmp = [s.F[0], s.F[1], s.F[2]];
    s.F[0] = s.R[0]; s.F[1] = s.R[1]; s.F[2] = s.R[2];
    s.R[0] = s.B[0]; s.R[1] = s.B[1]; s.R[2] = s.B[2];
    s.B[0] = s.L[0]; s.B[1] = s.L[1]; s.B[2] = s.L[2];
    s.L[0] = tmp[0]; s.L[1] = tmp[1]; s.L[2] = tmp[2];
  } else if (m === 'D') {
    const tmp = [s.F[6], s.F[7], s.F[8]];
    s.F[6] = s.L[6]; s.F[7] = s.L[7]; s.F[8] = s.L[8];
    s.L[6] = s.B[6]; s.L[7] = s.B[7]; s.L[8] = s.B[8];
    s.B[6] = s.R[6]; s.B[7] = s.R[7]; s.B[8] = s.R[8];
    s.R[6] = tmp[0]; s.R[7] = tmp[1]; s.R[8] = tmp[2];
  } else if (m === 'L') {
    const tmp = [s.U[0], s.U[3], s.U[6]];
    s.U[0] = s.B[8]; s.U[3] = s.B[5]; s.U[6] = s.B[2];
    s.B[8] = s.D[0]; s.B[5] = s.D[3]; s.B[2] = s.D[6];
    s.D[0] = s.F[0]; s.D[3] = s.F[3]; s.D[6] = s.F[6];
    s.F[0] = tmp[0]; s.F[3] = tmp[1]; s.F[6] = tmp[2];
  } else if (m === 'R') {
    const tmp = [s.U[2], s.U[5], s.U[8]];
    s.U[2] = s.F[2]; s.U[5] = s.F[5]; s.U[8] = s.F[8];
    s.F[2] = s.D[2]; s.F[5] = s.D[5]; s.F[8] = s.D[8];
    s.D[2] = s.B[6]; s.D[5] = s.B[3]; s.D[8] = s.B[0];
    s.B[6] = tmp[0]; s.B[3] = tmp[1]; s.B[0] = tmp[2];
  } else if (m === 'F') {
    const tmp = [s.U[6], s.U[7], s.U[8]];
    s.U[6] = s.L[8]; s.U[7] = s.L[5]; s.U[8] = s.L[2];
    s.L[2] = s.D[0]; s.L[5] = s.D[1]; s.L[8] = s.D[2];
    s.D[0] = s.R[6]; s.D[1] = s.R[3]; s.D[2] = s.R[0];
    s.R[0] = tmp[0]; s.R[3] = tmp[1]; s.R[6] = tmp[2];
  } else if (m === 'B') {
    const tmp = [s.U[0], s.U[1], s.U[2]];
    s.U[0] = s.R[2]; s.U[1] = s.R[5]; s.U[2] = s.R[8];
    s.R[2] = s.D[8]; s.R[5] = s.D[7]; s.R[8] = s.D[6];
    s.D[6] = s.L[0]; s.D[7] = s.L[3]; s.D[8] = s.L[6];
    s.L[0] = tmp[2]; s.L[3] = tmp[1]; s.L[6] = tmp[0];
  }
}

export function applyMove(cube: CubeFaceGrid, move: StandardMove): CubeFaceGrid {
  const result = cloneCube(cube);
  const face = move[0] as FaceKey;
  const isPrime = move.endsWith("'");
  const isDouble = move.endsWith('2');
  const count = isDouble ? 2 : isPrime ? 3 : 1;

  for (let i = 0; i < count; i++) {
    applySingleCW(result, face);
  }
  return result;
}

export function applyMoves(cube: CubeFaceGrid, moves: StandardMove[]): CubeFaceGrid {
  let curr = cube;
  for (const move of moves) {
    curr = applyMove(curr, move);
  }
  return curr;
}

export function isCubeSolved(cube: CubeFaceGrid): boolean {
  const faces: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  for (const f of faces) {
    const centerColor = cube[f][4];
    for (let i = 0; i < 9; i++) {
      if (cube[f][i] !== centerColor) return false;
    }
  }
  return true;
}

/**
 * Generates standard WCA compliant scramble sequence
 */
export function generateRandomScramble(length: number = 21): { moves: StandardMove[]; scrambleString: string } {
  const faces: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const opposites: Record<FaceKey, FaceKey> = {
    U: 'D',
    D: 'U',
    L: 'R',
    R: 'L',
    F: 'B',
    B: 'F',
  };

  const moves: StandardMove[] = [];
  let lastFace: FaceKey | null = null;
  let secondLastFace: FaceKey | null = null;

  while (moves.length < length) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    if (face === lastFace) continue;
    if (lastFace && opposites[face] === lastFace && face === secondLastFace) continue;

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    const move = `${face}${modifier}` as StandardMove;
    moves.push(move);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return {
    moves,
    scrambleString: moves.join(' '),
  };
}

export interface PresetPattern {
  id: string;
  name: string;
  description: string;
  moves: StandardMove[];
}

export const PRESET_PATTERNS: PresetPattern[] = [
  {
    id: 'checkerboard',
    name: 'Checkerboard',
    description: 'Alternating colors on every face',
    moves: ['U2', 'D2', 'F2', 'B2', 'L2', 'R2'],
  },
  {
    id: 'superflip',
    name: 'Superflip',
    description: 'All 12 edges flipped in place; hardest state to solve',
    moves: [
      'U', 'R2', 'F', 'B', 'R', 'B2', 'R', 'U2',
      'L', 'B2', 'R', "U'", "D'", 'R2', 'F', "R'",
      'L', 'B2', 'U2', 'F2',
    ],
  },
  {
    id: 'cube_in_cube',
    name: 'Cube in a Cube',
    description: 'A 2x2 mini-cube rotated inside the 3x3 cube',
    moves: [
      'F', 'L', 'F', "U'", 'R', 'U', 'F2', 'L2',
      "U'", "L'", 'B', "D'", "B'", 'L2', 'U',
    ],
  },
  {
    id: 'anaconda',
    name: 'Anaconda',
    description: 'A winding serpentine ribbon of color around the cube',
    moves: [
      'L', 'U', "B'", "U'", 'R', "L'", 'B', "R'",
      'F', "B'", 'D', 'R', "D'", "F'",
    ],
  },
  {
    id: 'cross_pattern',
    name: 'Cross Pattern',
    description: 'Clean plus crosses on all six faces',
    moves: [
      'R2', "L'", 'D', 'F2', "R'", "D'", 'R', "L",
      "U'", 'D', 'R', 'D', 'B2', "R'", "U", 'D2',
    ],
  },
];
