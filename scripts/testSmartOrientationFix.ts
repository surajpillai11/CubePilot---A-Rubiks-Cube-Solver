import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';

// Helper to rotate a face 90 deg clockwise
function rot90(f: CubeColor[]): CubeColor[] {
  return [
    f[6], f[3], f[0],
    f[7], f[4], f[1],
    f[8], f[5], f[2],
  ];
}

// Flip face horizontally
function flipH(f: CubeColor[]): CubeColor[] {
  return [
    f[2], f[1], f[0],
    f[5], f[4], f[3],
    f[8], f[7], f[6],
  ];
}

// Flip face vertically
function flipV(f: CubeColor[]): CubeColor[] {
  return [
    f[6], f[7], f[8],
    f[3], f[4], f[5],
    f[0], f[1], f[2],
  ];
}

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

export function smartOrientationFix(cube: CubeFaceGrid): CubeFaceGrid | null {
  const copy = cloneCube(cube);
  if (isSolvable(copy)) return copy;

  const faces: FaceKey[] = ['B', 'D', 'U', 'L', 'R', 'F'];

  // Test 1: Single face orientation fixes (90 deg, 180 deg, 270 deg, horizontal flip, vertical flip)
  for (const f of faces) {
    // 90 deg CW
    const t90 = cloneCube(copy);
    t90[f] = rot90(copy[f]);
    if (isSolvable(t90)) return t90;

    // 180 deg
    const t180 = cloneCube(copy);
    t180[f] = rot90(t90[f]);
    if (isSolvable(t180)) return t180;

    // 270 deg
    const t270 = cloneCube(copy);
    t270[f] = rot90(t180[f]);
    if (isSolvable(t270)) return t270;

    // Flip H
    const tFH = cloneCube(copy);
    tFH[f] = flipH(copy[f]);
    if (isSolvable(tFH)) return tFH;

    // Flip V
    const tFV = cloneCube(copy);
    tFV[f] = flipV(copy[f]);
    if (isSolvable(tFV)) return tFV;
  }

  // Test 2: Two faces both rotated/flipped (e.g. user flipped both B and D)
  for (let i = 0; i < faces.length; i++) {
    for (let j = i + 1; j < faces.length; j++) {
      const f1 = faces[i];
      const f2 = faces[j];
      const transforms = [
        (arr: CubeColor[]) => rot90(arr),
        (arr: CubeColor[]) => rot90(rot90(arr)),
        (arr: CubeColor[]) => rot90(rot90(rot90(arr))),
        (arr: CubeColor[]) => flipH(arr),
      ];

      for (const t1 of transforms) {
        for (const t2 of transforms) {
          const t = cloneCube(copy);
          t[f1] = t1(copy[f1]);
          t[f2] = t2(copy[f2]);
          if (isSolvable(t)) return t;
        }
      }
    }
  }

  return null;
}

// Test against Scenarios
const scramble = generateRandomScramble(15);
const validCube = applyMoves(createSolvedCube(), scramble.moves);

// Scenario 1: B flipped horizontally
const bFlipped = cloneCube(validCube);
bFlipped.B = flipH(validCube.B);
console.log('Testing repair for Scenario 1 (B flipped):', smartOrientationFix(bFlipped) !== null);

// Scenario 2: D rotated 180
const dRot180 = cloneCube(validCube);
dRot180.D = rot90(rot90(validCube.D));
console.log('Testing repair for Scenario 2 (D rotated 180):', smartOrientationFix(dRot180) !== null);

// Scenario 3: B rotated 180
const bRot180 = cloneCube(validCube);
bRot180.B = rot90(rot90(validCube.B));
console.log('Testing repair for Scenario 3 (B rotated 180):', smartOrientationFix(bRot180) !== null);
