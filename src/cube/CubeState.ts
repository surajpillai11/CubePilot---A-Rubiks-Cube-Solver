import { CubeColor, CubeFaceGrid, FaceKey, StandardMove } from '../types/cube';
import {
  cubeFromFaces,
  CornerTwistError,
  EdgeFlipError,
  ParityError,
  Faces,
} from '@turnwise/cube-solver';

/**
 * Creates a blank cube ready for manual painting:
 * Centers are pre-filled with standard face colors (White, Yellow, Orange, Red, Green, Blue)
 * so the user knows which face corresponds to which side of the physical cube.
 * All other 48 stickers start empty ('empty').
 */
export function createBlankCube(): CubeFaceGrid {
  return {
    U: ['empty', 'empty', 'empty', 'empty', 'white', 'empty', 'empty', 'empty', 'empty'],
    D: ['empty', 'empty', 'empty', 'empty', 'yellow', 'empty', 'empty', 'empty', 'empty'],
    L: ['empty', 'empty', 'empty', 'empty', 'orange', 'empty', 'empty', 'empty', 'empty'],
    R: ['empty', 'empty', 'empty', 'empty', 'red', 'empty', 'empty', 'empty', 'empty'],
    F: ['empty', 'empty', 'empty', 'empty', 'green', 'empty', 'empty', 'empty', 'empty'],
    B: ['empty', 'empty', 'empty', 'empty', 'blue', 'empty', 'empty', 'empty', 'empty'],
  };
}

/**
 * Creates an entirely blank cube where even centers are empty.
 */
export function createCompletelyBlankCube(): CubeFaceGrid {
  return {
    U: Array(9).fill('empty'),
    D: Array(9).fill('empty'),
    L: Array(9).fill('empty'),
    R: Array(9).fill('empty'),
    F: Array(9).fill('empty'),
    B: Array(9).fill('empty'),
  };
}

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
    if (centerColor === 'empty') return false;
    for (let i = 0; i < 9; i++) {
      if (cube[f][i] === 'empty' || cube[f][i] !== centerColor) return false;
    }
  }
  return true;
}

function rot90Face(f: CubeColor[]): CubeColor[] {
  return [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
}
function rot180Face(f: CubeColor[]): CubeColor[] {
  return rot90Face(rot90Face(f));
}
function rot270Face(f: CubeColor[]): CubeColor[] {
  return rot90Face(rot180Face(f));
}
function flipHFace(f: CubeColor[]): CubeColor[] {
  return [f[2], f[1], f[0], f[5], f[4], f[3], f[8], f[7], f[6]];
}
function flipVFace(f: CubeColor[]): CubeColor[] {
  return [f[6], f[7], f[8], f[3], f[4], f[5], f[0], f[1], f[2]];
}

// Whole-cube 3D rotations (turn entire cube rigidly)
export function rotateCubeY(c: CubeFaceGrid): CubeFaceGrid {
  return {
    U: rot90Face(c.U),
    D: rot270Face(c.D),
    F: c.R,
    R: c.B,
    B: c.L,
    L: c.F,
  };
}

export function rotateCubeX(c: CubeFaceGrid): CubeFaceGrid {
  return {
    R: rot90Face(c.R),
    L: rot270Face(c.L),
    U: c.F,
    B: rot180Face(c.U),
    D: rot180Face(c.B),
    F: c.D,
  };
}

export function rotateCubeZ(c: CubeFaceGrid): CubeFaceGrid {
  return {
    F: rot90Face(c.F),
    B: rot270Face(c.B),
    U: rot90Face(c.L),
    R: rot90Face(c.U),
    D: rot90Face(c.R),
    L: rot90Face(c.D),
  };
}

export function getAll24CubeRotations(cube: CubeFaceGrid): CubeFaceGrid[] {
  const result: CubeFaceGrid[] = [];
  const visited = new Set<string>();
  const queue: CubeFaceGrid[] = [cloneCube(cube)];
  const hash = (c: CubeFaceGrid) => `${c.U[4]}-${c.F[4]}-${c.R[4]}`;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const key = hash(curr);
    if (!visited.has(key)) {
      visited.add(key);
      result.push(curr);
      queue.push(rotateCubeX(curr));
      queue.push(rotateCubeY(curr));
      queue.push(rotateCubeZ(curr));
    }
  }

  return result;
}

/**
 * Normalizes any valid solvable cube configuration to standard Western orientation:
 * Top = White, Front = Green, Right = Red.
 * This guarantees notation (R, U, F...) matches the 3D visual tutor instructions.
 */
export function normalizeToStandardOrientation(cube: CubeFaceGrid): CubeFaceGrid {
  const all24 = getAll24CubeRotations(cube);
  for (const c of all24) {
    if (c.U[4] === 'white' && c.F[4] === 'green' && c.R[4] === 'red') {
      return c;
    }
  }
  return cube;
}

const OPPOSITES: Record<CubeColor, CubeColor> = {
  white: 'yellow', yellow: 'white',
  green: 'blue', blue: 'green',
  red: 'orange', orange: 'red',
  empty: 'empty',
};

const TOP_FRONT_PAIRS: Array<[CubeColor, CubeColor, CubeColor]> = [
  ['white', 'green', 'red'], ['white', 'red', 'blue'], ['white', 'blue', 'orange'], ['white', 'orange', 'green'],
  ['yellow', 'green', 'orange'], ['yellow', 'orange', 'blue'], ['yellow', 'blue', 'red'], ['yellow', 'red', 'green'],
  ['green', 'white', 'orange'], ['green', 'orange', 'yellow'], ['green', 'yellow', 'red'], ['green', 'red', 'white'],
  ['blue', 'white', 'red'], ['blue', 'red', 'yellow'], ['blue', 'yellow', 'orange'], ['blue', 'orange', 'white'],
  ['red', 'white', 'green'], ['red', 'green', 'yellow'], ['red', 'yellow', 'blue'], ['red', 'blue', 'white'],
  ['orange', 'white', 'blue'], ['orange', 'blue', 'yellow'], ['orange', 'yellow', 'green'], ['orange', 'green', 'white'],
];

const ALL_24_CENTERS = TOP_FRONT_PAIRS.map(([top, front, right]) => ({
  U: top, F: front, R: right,
  L: OPPOSITES[right], B: OPPOSITES[front], D: OPPOSITES[top],
}));

/**
 * Comprehensive Smart Auto-Fix:
 * Automatically repairs physical errors:
 * - 24 3D cube orientations (when user held cube with a different color facing top/front)
 * - Single face orientation transforms (rot90, rot180, rot270, flipH, flipV across all 6 faces)
 * - 24 orientations combined with face transforms
 * - Multi-face orientation transforms (e.g. Back face flipped horizontally AND Down rotated 180)
 * - Corner twists across all 8 corners
 * - Edge flips across all 12 edges
 * - Permutation parity swaps
 * - Single sticker count typos (excess 1, deficit 1)
 * - Candidate 2-sticker swaps across non-centers
 *
 * Automatically normalizes any repaired cube to standard orientation (White top, Green front).
 */
export function autoFixCubeParity(cube: CubeFaceGrid): CubeFaceGrid | null {
  const copy = cloneCube(cube);

  const isSolvable = (c: CubeFaceGrid): boolean => {
    try {
      const colorToFace: Record<string, any> = {
        [c.U[4]]: Faces.U,
        [c.R[4]]: Faces.R,
        [c.F[4]]: Faces.F,
        [c.D[4]]: Faces.D,
        [c.L[4]]: Faces.L,
        [c.B[4]]: Faces.B,
      };
      const grid = {
        U: c.U.map((col) => colorToFace[col]),
        R: c.R.map((col) => colorToFace[col]),
        F: c.F.map((col) => colorToFace[col]),
        D: c.D.map((col) => colorToFace[col]),
        L: c.L.map((col) => colorToFace[col]),
        B: c.B.map((col) => colorToFace[col]),
      };
      cubeFromFaces(grid as any);
      return true;
    } catch {
      return false;
    }
  };

  if (isSolvable(copy)) return normalizeToStandardOrientation(copy);

  const faceKeys: FaceKey[] = ['B', 'D', 'U', 'L', 'R', 'F'];
  const transforms = [rot90Face, rot180Face, rot270Face, flipHFace, flipVFace];

  // 1. Try 24 center orientations directly (re-anchors centers if user painted from a different perspective)
  for (const centers of ALL_24_CENTERS) {
    const candidate = cloneCube(copy);
    candidate.U[4] = centers.U; candidate.F[4] = centers.F; candidate.R[4] = centers.R;
    candidate.D[4] = centers.D; candidate.L[4] = centers.L; candidate.B[4] = centers.B;
    if (isSolvable(candidate)) return normalizeToStandardOrientation(candidate);
  }

  // 2. Try single face orientation transforms (Back, Down, Up, Left, Right, Front)
  for (const f of faceKeys) {
    for (const t of transforms) {
      const candidate = cloneCube(copy);
      candidate[f] = t(copy[f]);
      if (isSolvable(candidate)) return normalizeToStandardOrientation(candidate);
    }
  }

  // 3. Try 24 center orientations with single face orientation transforms
  for (const centers of ALL_24_CENTERS) {
    for (const f of faceKeys) {
      for (const t of transforms) {
        const candidate = cloneCube(copy);
        candidate.U[4] = centers.U; candidate.F[4] = centers.F; candidate.R[4] = centers.R;
        candidate.D[4] = centers.D; candidate.L[4] = centers.L; candidate.B[4] = centers.B;
        candidate[f] = t(candidate[f]);
        if (isSolvable(candidate)) return normalizeToStandardOrientation(candidate);
      }
    }
  }

  // 4. Try two-face orientation transforms (e.g. Back flipped and Down rotated 180)
  for (let i = 0; i < faceKeys.length - 1; i++) {
    for (let j = i + 1; j < faceKeys.length; j++) {
      const f1 = faceKeys[i];
      const f2 = faceKeys[j];
      for (const t1 of transforms) {
        for (const t2 of transforms) {
          const candidate = cloneCube(copy);
          candidate[f1] = t1(copy[f1]);
          candidate[f2] = t2(copy[f2]);
          if (isSolvable(candidate)) return normalizeToStandardOrientation(candidate);
        }
      }
    }
  }

  // 5. Try 8 corner twists
  const corners = [
    [{ f: 'U' as FaceKey, i: 8 }, { f: 'R' as FaceKey, i: 0 }, { f: 'F' as FaceKey, i: 2 }],
    [{ f: 'U' as FaceKey, i: 6 }, { f: 'F' as FaceKey, i: 0 }, { f: 'L' as FaceKey, i: 2 }],
    [{ f: 'U' as FaceKey, i: 0 }, { f: 'L' as FaceKey, i: 0 }, { f: 'B' as FaceKey, i: 2 }],
    [{ f: 'U' as FaceKey, i: 2 }, { f: 'B' as FaceKey, i: 0 }, { f: 'R' as FaceKey, i: 2 }],
    [{ f: 'D' as FaceKey, i: 2 }, { f: 'F' as FaceKey, i: 8 }, { f: 'R' as FaceKey, i: 6 }],
    [{ f: 'D' as FaceKey, i: 0 }, { f: 'L' as FaceKey, i: 8 }, { f: 'F' as FaceKey, i: 6 }],
    [{ f: 'D' as FaceKey, i: 6 }, { f: 'B' as FaceKey, i: 8 }, { f: 'L' as FaceKey, i: 6 }],
    [{ f: 'D' as FaceKey, i: 8 }, { f: 'R' as FaceKey, i: 8 }, { f: 'B' as FaceKey, i: 6 }],
  ];

  for (const c of corners) {
    const t1 = cloneCube(copy);
    const u = t1[c[0].f][c[0].i], r = t1[c[1].f][c[1].i], f = t1[c[2].f][c[2].i];
    t1[c[0].f][c[0].i] = f; t1[c[1].f][c[1].i] = u; t1[c[2].f][c[2].i] = r;
    if (isSolvable(t1)) return normalizeToStandardOrientation(t1);

    const t2 = cloneCube(copy);
    t2[c[0].f][c[0].i] = r; t2[c[1].f][c[1].i] = f; t2[c[2].f][c[2].i] = u;
    if (isSolvable(t2)) return normalizeToStandardOrientation(t2);
  }

  // 6. Try 12 edge flips
  const edges = [
    [{ f: 'U' as FaceKey, i: 5 }, { f: 'R' as FaceKey, i: 1 }],
    [{ f: 'U' as FaceKey, i: 7 }, { f: 'F' as FaceKey, i: 1 }],
    [{ f: 'U' as FaceKey, i: 3 }, { f: 'L' as FaceKey, i: 1 }],
    [{ f: 'U' as FaceKey, i: 1 }, { f: 'B' as FaceKey, i: 1 }],
    [{ f: 'D' as FaceKey, i: 5 }, { f: 'R' as FaceKey, i: 7 }],
    [{ f: 'D' as FaceKey, i: 1 }, { f: 'F' as FaceKey, i: 7 }],
    [{ f: 'D' as FaceKey, i: 3 }, { f: 'L' as FaceKey, i: 7 }],
    [{ f: 'D' as FaceKey, i: 7 }, { f: 'B' as FaceKey, i: 7 }],
    [{ f: 'F' as FaceKey, i: 5 }, { f: 'R' as FaceKey, i: 3 }],
    [{ f: 'F' as FaceKey, i: 3 }, { f: 'L' as FaceKey, i: 5 }],
    [{ f: 'B' as FaceKey, i: 5 }, { f: 'L' as FaceKey, i: 3 }],
    [{ f: 'B' as FaceKey, i: 3 }, { f: 'R' as FaceKey, i: 5 }],
  ];

  for (const e of edges) {
    const t = cloneCube(copy);
    const tmp = t[e[0].f][e[0].i];
    t[e[0].f][e[0].i] = t[e[1].f][e[1].i];
    t[e[1].f][e[1].i] = tmp;
    if (isSolvable(t)) return normalizeToStandardOrientation(t);
  }

  // 7. Try edge swap parity
  for (let i = 0; i < edges.length - 1; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      const e1 = edges[i];
      const e2 = edges[j];
      const t = cloneCube(copy);
      const s0 = t[e1[0].f][e1[0].i];
      const s1 = t[e1[1].f][e1[1].i];
      t[e1[0].f][e1[0].i] = t[e2[0].f][e2[0].i];
      t[e1[1].f][e1[1].i] = t[e2[1].f][e2[1].i];
      t[e2[0].f][e2[0].i] = s0;
      t[e2[1].f][e2[1].i] = s1;
      if (isSolvable(t)) return normalizeToStandardOrientation(t);
    }
  }

  // 8. Try resolving single sticker count typo (e.g. 10 yellow, 8 white)
  const counts: Record<CubeColor, number> = { white: 0, yellow: 0, red: 0, orange: 0, green: 0, blue: 0, empty: 0 };
  for (const f of faceKeys) {
    for (let i = 0; i < 9; i++) {
      counts[copy[f][i]]++;
    }
  }

  const excess = Object.entries(counts).filter(([c, n]) => c !== 'empty' && n > 9).map(([c]) => c as CubeColor);
  const deficit = Object.entries(counts).filter(([c, n]) => c !== 'empty' && n < 9).map(([c]) => c as CubeColor);

  if (excess.length === 1 && deficit.length === 1) {
    const fromColor = excess[0];
    const toColor = deficit[0];
    for (const f of faceKeys) {
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;
        if (copy[f][i] === fromColor) {
          const t = cloneCube(copy);
          t[f][i] = toColor;
          if (isSolvable(t)) return normalizeToStandardOrientation(t);
        }
      }
    }
  }

  // 9. Try candidate non-center 2-sticker swaps if all counts are 9
  const allCounts9 = Object.entries(counts).every(([c, n]) => c === 'empty' || n === 9);
  if (allCounts9) {
    const nonCenters: Array<{ f: FaceKey; i: number }> = [];
    for (const f of faceKeys) {
      for (let i = 0; i < 9; i++) {
        if (i !== 4) nonCenters.push({ f, i });
      }
    }

    for (let a = 0; a < nonCenters.length - 1; a++) {
      for (let b = a + 1; b < nonCenters.length; b++) {
        const p1 = nonCenters[a];
        const p2 = nonCenters[b];
        if (copy[p1.f][p1.i] === copy[p2.f][p2.i]) continue;

        const t = cloneCube(copy);
        const tmp = t[p1.f][p1.i];
        t[p1.f][p1.i] = t[p2.f][p2.i];
        t[p2.f][p2.i] = tmp;
        if (isSolvable(t)) return normalizeToStandardOrientation(t);
      }
    }
  }

  return null;
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
