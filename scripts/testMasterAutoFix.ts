import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';

// Helper rotations
function rot90(f: CubeColor[]): CubeColor[] {
  return [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
}
function rot180(f: CubeColor[]): CubeColor[] {
  return rot90(rot90(f));
}
function rot270(f: CubeColor[]): CubeColor[] {
  return rot90(rot180(f));
}
function flipH(f: CubeColor[]): CubeColor[] {
  return [f[2], f[1], f[0], f[5], f[4], f[3], f[8], f[7], f[6]];
}
function flipV(f: CubeColor[]): CubeColor[] {
  return [f[6], f[7], f[8], f[3], f[4], f[5], f[0], f[1], f[2]];
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

const ALL_24_ORIENTATIONS = TOP_FRONT_PAIRS.map(([top, front, right]) => ({
  U: top, F: front, R: right,
  L: OPPOSITES[right], B: OPPOSITES[front], D: OPPOSITES[top],
}));

export function isSolvable(c: CubeFaceGrid): boolean {
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
}

export function masterAutoFix(cube: CubeFaceGrid): CubeFaceGrid | null {
  const copy = cloneCube(cube);
  if (isSolvable(copy)) return copy;

  // 1. Try all 24 orientations if centers were entered differently
  for (const ori of ALL_24_ORIENTATIONS) {
    try {
      const colorToFace: Record<string, any> = {
        [ori.U]: Faces.U, [ori.R]: Faces.R, [ori.F]: Faces.F,
        [ori.D]: Faces.D, [ori.L]: Faces.L, [ori.B]: Faces.B,
      };
      const grid = {
        U: copy.U.map((c) => colorToFace[c]),
        R: copy.R.map((c) => colorToFace[c]),
        F: copy.F.map((c) => colorToFace[c]),
        D: copy.D.map((c) => colorToFace[c]),
        L: copy.L.map((c) => colorToFace[c]),
        B: copy.B.map((c) => colorToFace[c]),
      };
      cubeFromFaces(grid as any);
      // Re-anchor centers to match this valid orientation
      const reanchored = cloneCube(copy);
      reanchored.U[4] = ori.U; reanchored.F[4] = ori.F; reanchored.R[4] = ori.R;
      reanchored.L[4] = ori.L; reanchored.B[4] = ori.B; reanchored.D[4] = ori.D;
      return reanchored;
    } catch {}
  }

  // 2. Try single face orientation fix (Back, Down, Up, Left, Right, Front)
  const faceKeys: FaceKey[] = ['B', 'D', 'U', 'L', 'R', 'F'];
  const transforms = [rot90, rot180, rot270, flipH, flipV];

  for (const f of faceKeys) {
    for (const t of transforms) {
      const candidate = cloneCube(copy);
      candidate[f] = t(copy[f]);
      if (isSolvable(candidate)) return candidate;
    }
  }

  // 3. Try 8 corner twists
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
    if (isSolvable(t1)) return t1;

    const t2 = cloneCube(copy);
    t2[c[0].f][c[0].i] = r; t2[c[1].f][c[1].i] = f; t2[c[2].f][c[2].i] = u;
    if (isSolvable(t2)) return t2;
  }

  // 4. Try 12 edge flips
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
    if (isSolvable(t)) return t;
  }

  // 5. Try edge swap parity
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
      if (isSolvable(t)) return t;
    }
  }

  // 6. Try two-face rotation combinations (e.g. Back AND Down rotated)
  for (let i = 0; i < faceKeys.length - 1; i++) {
    for (let j = i + 1; j < faceKeys.length; j++) {
      const f1 = faceKeys[i];
      const f2 = faceKeys[j];
      for (const t1 of [rot90, rot180, rot270, flipH]) {
        for (const t2 of [rot90, rot180, rot270, flipH]) {
          const candidate = cloneCube(copy);
          candidate[f1] = t1(copy[f1]);
          candidate[f2] = t2(copy[f2]);
          if (isSolvable(candidate)) return candidate;
        }
      }
    }
  }

  // 7. Try candidate 2-sticker swaps across non-centers
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
      if (isSolvable(t)) return t;
    }
  }

  return null;
}

// Test cases
const sc = generateRandomScramble(20);
const valid = applyMoves(createSolvedCube(), sc.moves);

// Test 1: B face rotated 180
const b180 = cloneCube(valid);
b180.B = rot180(valid.B);
console.log('Fix B 180:', masterAutoFix(b180) !== null);

// Test 2: B face flipped horizontally
const bH = cloneCube(valid);
bH.B = flipH(valid.B);
console.log('Fix B flipH:', masterAutoFix(bH) !== null);

// Test 3: D face rotated 90
const d90 = cloneCube(valid);
d90.D = rot90(valid.D);
console.log('Fix D rot90:', masterAutoFix(d90) !== null);

// Test 4: Both B flipped and D rotated 180
const bd = cloneCube(valid);
bd.B = flipH(valid.B);
bd.D = rot180(valid.D);
console.log('Fix B flip + D 180:', masterAutoFix(bd) !== null);
