import { createSolvedCube, cloneCube } from '../src/cube/CubeState';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';

export function smartAutoFixCube(cube: CubeFaceGrid): CubeFaceGrid | null {
  const copy = cloneCube(cube);

  // Helper to test if a grid is solvable
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

  if (isSolvable(copy)) return copy;

  // 1. Try 8 corner twists
  const corners = [
    [{ f: 'U', i: 8 }, { f: 'R', i: 0 }, { f: 'F', i: 2 }],
    [{ f: 'U', i: 6 }, { f: 'F', i: 0 }, { f: 'L', i: 2 }],
    [{ f: 'U', i: 0 }, { f: 'L', i: 0 }, { f: 'B', i: 2 }],
    [{ f: 'U', i: 2 }, { f: 'B', i: 0 }, { f: 'R', i: 2 }],
    [{ f: 'D', i: 2 }, { f: 'F', i: 8 }, { f: 'R', i: 6 }],
    [{ f: 'D', i: 0 }, { f: 'L', i: 8 }, { f: 'F', i: 6 }],
    [{ f: 'D', i: 6 }, { f: 'B', i: 8 }, { f: 'L', i: 6 }],
    [{ f: 'D', i: 8 }, { f: 'R', i: 8 }, { f: 'B', i: 6 }],
  ] as const;

  for (const c of corners) {
    // Twist 1
    const t1 = cloneCube(copy);
    const u = t1[c[0].f][c[0].i], r = t1[c[1].f][c[1].i], f = t1[c[2].f][c[2].i];
    t1[c[0].f][c[0].i] = f; t1[c[1].f][c[1].i] = u; t1[c[2].f][c[2].i] = r;
    if (isSolvable(t1)) return t1;

    // Twist 2
    const t2 = cloneCube(copy);
    t2[c[0].f][c[0].i] = r; t2[c[1].f][c[1].i] = f; t2[c[2].f][c[2].i] = u;
    if (isSolvable(t2)) return t2;
  }

  // 2. Try 12 edge flips
  const edges = [
    [{ f: 'U', i: 5 }, { f: 'R', i: 1 }],
    [{ f: 'U', i: 7 }, { f: 'F', i: 1 }],
    [{ f: 'U', i: 3 }, { f: 'L', i: 1 }],
    [{ f: 'U', i: 1 }, { f: 'B', i: 1 }],
    [{ f: 'D', i: 5 }, { f: 'R', i: 7 }],
    [{ f: 'D', i: 1 }, { f: 'F', i: 7 }],
    [{ f: 'D', i: 3 }, { f: 'L', i: 7 }],
    [{ f: 'D', i: 7 }, { f: 'B', i: 7 }],
    [{ f: 'F', i: 5 }, { f: 'R', i: 3 }],
    [{ f: 'F', i: 3 }, { f: 'L', i: 5 }],
    [{ f: 'B', i: 5 }, { f: 'L', i: 3 }],
    [{ f: 'B', i: 3 }, { f: 'R', i: 5 }],
  ] as const;

  for (const e of edges) {
    const t = cloneCube(copy);
    const tmp = t[e[0].f][e[0].i];
    t[e[0].f][e[0].i] = t[e[1].f][e[1].i];
    t[e[1].f][e[1].i] = tmp;
    if (isSolvable(t)) return t;
  }

  // 3. Try edge swap parity
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

  // 4. Try resolving single sticker typo (count mismatch: one color has 10, another has 8)
  const faces: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const counts: Record<CubeColor, number> = { white: 0, yellow: 0, red: 0, orange: 0, green: 0, blue: 0, empty: 0 };
  for (const f of faces) {
    for (let i = 0; i < 9; i++) {
      counts[copy[f][i]]++;
    }
  }

  const excess = Object.entries(counts).filter(([c, n]) => c !== 'empty' && n > 9).map(([c]) => c as CubeColor);
  const deficit = Object.entries(counts).filter(([c, n]) => c !== 'empty' && n < 9).map(([c]) => c as CubeColor);

  if (excess.length === 1 && deficit.length === 1) {
    const fromColor = excess[0];
    const toColor = deficit[0];
    // Find non-center sticker of fromColor to replace with toColor
    for (const f of faces) {
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue; // center
        if (copy[f][i] === fromColor) {
          const t = cloneCube(copy);
          t[f][i] = toColor;
          if (isSolvable(t)) return t;
        }
      }
    }
  }

  // 5. Try candidate non-center 2-sticker swaps if counts are 9
  const allCounts9 = Object.entries(counts).every(([c, n]) => c === 'empty' || n === 9);
  if (allCounts9) {
    const nonCenters: Array<{ f: FaceKey; i: number }> = [];
    for (const f of faces) {
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
  }

  return null;
}

// Test typo fix
const cube = cloneCube(createSolvedCube());
// Introduce typo: replace a white sticker with yellow
cube.U[0] = 'yellow';
console.log('Testing typo fix (10 yellow, 8 white):');
const start = performance.now();
const repaired = smartAutoFixCube(cube);
const dur = Math.round(performance.now() - start);
console.log(`Repaired in ${dur}ms?`, repaired !== null);
