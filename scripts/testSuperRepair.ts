import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';
import { rotateCubeX, rotateCubeY, rotateCubeZ } from './testWholeCubeRotations';
import { getAll24CubeRotations } from './testGenerate24';
import { cubeFromFaces, Faces, solve as solveKociemba } from '@turnwise/cube-solver';

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

const solvedRotations = getAll24CubeRotations(createSolvedCube());
const ALL_24_CENTERS = solvedRotations.map(c => ({
  U: c.U[4], F: c.F[4], R: c.R[4], D: c.D[4], L: c.L[4], B: c.B[4]
}));

export const isSolvable = (c: CubeFaceGrid): boolean => {
  try {
    const colorToFace: Record<string, any> = {
      [c.U[4]]: Faces.U, [c.R[4]]: Faces.R, [c.F[4]]: Faces.F,
      [c.D[4]]: Faces.D, [c.L[4]]: Faces.L, [c.B[4]]: Faces.B,
    };
    const grid = {
      U: c.U.map((col) => colorToFace[col]),
      R: c.R.map((col) => colorToFace[col]),
      F: c.F.map((col) => colorToFace[col]),
      D: c.D.map((col) => colorToFace[col]),
      L: c.L.map((col) => colorToFace[col]),
      B: c.B.map((col) => colorToFace[col]),
    };
    const kCube = cubeFromFaces(grid as any);
    solveKociemba(kCube);
    return true;
  } catch (err: any) {
    return false;
  }
};

/**
 * Normalizes a solvable cube to standard Western orientation:
 * Top = white, Front = green, Right = red
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

/**
 * Super Auto Repair:
 * 1. Direct check
 * 2. 24 center orientations (re-anchors centers if user painted from a different perspective)
 * 3. Single face orientation transforms (rot90, rot180, rot270, flipH, flipV across all 6 faces)
 * 4. 24 center orientations x single face transforms (resolves user perspective + tilt)
 * 5. Two-face orientation transforms (e.g. Back flipped + Down rotated)
 * 6. Corner twists (8 corners)
 * 7. Edge flips (12 edges)
 * 8. Edge swap parity
 * 9. 1-sticker count typos
 * 10. Candidate 2-sticker swaps
 */
export function superAutoRepair(cube: CubeFaceGrid): CubeFaceGrid | null {
  const copy = cloneCube(cube);
  if (isSolvable(copy)) return normalizeToStandardOrientation(copy);

  const faceKeys: FaceKey[] = ['B', 'D', 'U', 'L', 'R', 'F'];
  const transforms = [rot90, rot180, rot270, flipH, flipV];

  // 1. Try 24 center orientations directly
  for (const centers of ALL_24_CENTERS) {
    const candidate = cloneCube(copy);
    candidate.U[4] = centers.U; candidate.F[4] = centers.F; candidate.R[4] = centers.R;
    candidate.D[4] = centers.D; candidate.L[4] = centers.L; candidate.B[4] = centers.B;
    if (isSolvable(candidate)) return normalizeToStandardOrientation(candidate);
  }

  // 2. Try single face orientation transforms
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

  // 9. Try candidate 2-sticker swaps across non-centers
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

// RUN THE TEST SUITE
console.log('--- RUNNING TEST SUITE ---');
const sc = generateRandomScramble(25);
const valid = applyMoves(createSolvedCube(), sc.moves);

// Test A: Rotated cube entered into standard net
const all24 = getAll24CubeRotations(valid);
const rotatedInput = cloneCube(all24[7]);
rotatedInput.U[4] = 'white'; rotatedInput.F[4] = 'green'; rotatedInput.R[4] = 'red';
rotatedInput.D[4] = 'yellow'; rotatedInput.L[4] = 'orange'; rotatedInput.B[4] = 'blue';
console.log('Test A (Rotated cube input):', superAutoRepair(rotatedInput) !== null);

// Test B: Back face flipped horizontally
const bFlip = cloneCube(valid);
bFlip.B = flipH(valid.B);
console.log('Test B (Back flipped):', superAutoRepair(bFlip) !== null);

// Test C: Down face rotated 180
const dRot = cloneCube(valid);
dRot.D = rot180(valid.D);
console.log('Test C (Down 180):', superAutoRepair(dRot) !== null);

// Test D: Back flipped AND Down rotated 180
const bdComb = cloneCube(valid);
bdComb.B = flipH(valid.B);
bdComb.D = rot180(valid.D);
console.log('Test D (Back flipped + Down 180):', superAutoRepair(bdComb) !== null);

// Test E: Rotated perspective + Back face flipped
const rotPlusFlip = cloneCube(all24[3]);
rotPlusFlip.U[4] = 'white'; rotPlusFlip.F[4] = 'green'; rotPlusFlip.R[4] = 'red';
rotPlusFlip.D[4] = 'yellow'; rotPlusFlip.L[4] = 'orange'; rotPlusFlip.B[4] = 'blue';
rotPlusFlip.B = flipH(rotPlusFlip.B);
console.log('Test E (Rotated perspective + Back flipped):', superAutoRepair(rotPlusFlip) !== null);

// Test F: 1 corner twisted
const cornerTwist = cloneCube(valid);
const c0 = cornerTwist.U[8];
cornerTwist.U[8] = cornerTwist.R[0];
cornerTwist.R[0] = cornerTwist.F[2];
cornerTwist.F[2] = c0;
console.log('Test F (Corner twisted):', superAutoRepair(cornerTwist) !== null);

// Test G: 1 edge flipped
const edgeFlip = cloneCube(valid);
const e0 = edgeFlip.U[7];
edgeFlip.U[7] = edgeFlip.F[1];
edgeFlip.F[1] = e0;
console.log('Test G (Edge flipped):', superAutoRepair(edgeFlip) !== null);

// Test H: 2 non-center stickers swapped
const swappedStickers = cloneCube(valid);
const s0 = swappedStickers.U[0];
swappedStickers.U[0] = swappedStickers.D[8];
swappedStickers.D[8] = s0;
console.log('Test H (2 stickers swapped):', superAutoRepair(swappedStickers) !== null);

// Test I: 1 sticker count typo (10 yellow, 8 white)
const typoCount = cloneCube(valid);
typoCount.U[0] = 'yellow'; // was white
console.log('Test I (1-sticker count typo):', superAutoRepair(typoCount) !== null);
