import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { CubeFaceGrid, FaceKey, CubeColor, StandardMove } from '../src/types/cube';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';

// A whole-cube turn can be represented by 3 face turns on parallel layers!
// But our applyMove in CubeState already implements all standard moves: U, D, L, R, F, B!
// Can we implement whole cube rotations rotateX, rotateY, rotateZ?
// Let's verify what happens when we rotate the cube!

function rot90(f: CubeColor[]): CubeColor[] {
  return [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
}
function rot180(f: CubeColor[]): CubeColor[] {
  return rot90(rot90(f));
}
function rot270(f: CubeColor[]): CubeColor[] {
  return rot90(rot180(f));
}

// rotateY: turn entire cube around Y axis (looking down from top, CW)
export function rotateCubeY(c: CubeFaceGrid): CubeFaceGrid {
  return {
    U: rot90(c.U),
    D: rot270(c.D),
    F: c.R,
    R: c.B,
    B: c.L,
    L: c.F,
  };
}

// rotateX: turn entire cube around X axis (looking from right, CW)
// F -> U -> B -> D -> F
// Note: When F moves to U, U moves to B (upside down), B moves to D, D moves to F
export function rotateCubeX(c: CubeFaceGrid): CubeFaceGrid {
  return {
    R: rot90(c.R),
    L: rot270(c.L),
    U: c.F,
    B: rot180(c.U),
    D: rot180(c.B),
    F: c.D,
  };
}

// rotateZ: turn entire cube around Z axis (looking from front, CW)
// U -> R -> D -> L -> U
export function rotateCubeZ(c: CubeFaceGrid): CubeFaceGrid {
  return {
    F: rot90(c.F),
    B: rot270(c.B),
    U: rot90(c.L),
    R: rot90(c.U),
    D: rot90(c.R),
    L: rot90(c.D),
  };
}

const isSolvable = (c: CubeFaceGrid): boolean => {
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
    cubeFromFaces(grid as any);
    return true;
  } catch (err: any) {
    return false;
  }
};

const solved = createSolvedCube();
console.log('Solved is solvable:', isSolvable(solved));

let cy = rotateCubeY(solved);
console.log('rotateCubeY is solvable:', isSolvable(cy));

let cx = rotateCubeX(solved);
console.log('rotateCubeX is solvable:', isSolvable(cx));

let cz = rotateCubeZ(solved);
console.log('rotateCubeZ is solvable:', isSolvable(cz));
