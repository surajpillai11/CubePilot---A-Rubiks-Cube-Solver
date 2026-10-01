import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { cubeFromFaces, Faces, solve, formatAlgorithm } from '@turnwise/cube-solver';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';

// In our solveCube and validateCubeState:
// How do we map colors to Faces?
// Look at how we currently do it:
function solveWithCustomCenters(cube: CubeFaceGrid) {
  const colorToFace: Record<string, any> = {
    [cube.U[4]]: Faces.U,
    [cube.R[4]]: Faces.R,
    [cube.F[4]]: Faces.F,
    [cube.D[4]]: Faces.D,
    [cube.L[4]]: Faces.L,
    [cube.B[4]]: Faces.B,
  };

  const grid = {
    U: cube.U.map((col) => colorToFace[col]),
    R: cube.R.map((col) => colorToFace[col]),
    F: cube.F.map((col) => colorToFace[col]),
    D: cube.D.map((col) => colorToFace[col]),
    L: cube.L.map((col) => colorToFace[col]),
    B: cube.B.map((col) => colorToFace[col]),
  };

  try {
    const kCube = cubeFromFaces(grid as any);
    const alg = formatAlgorithm(solve(kCube));
    return { success: true, alg };
  } catch (err: any) {
    return { success: false, err: `${err.constructor.name}: ${err.message}` };
  }
}

// Case 1: Standard centers (U=white, F=green, R=red, L=orange, B=blue, D=yellow)
const sc = generateRandomScramble(10);
const c1 = applyMoves(createSolvedCube(), sc.moves);
console.log('Case 1 (Standard orientation):', solveWithCustomCenters(c1));

// Case 2: What if centers are different?
// Suppose cube was held with Yellow on Top (U=yellow, D=white, F=green, B=blue, R=orange, L=red)
// That's an upside down cube!
const c2 = cloneCube(c1);
c2.U[4] = 'yellow';
c2.D[4] = 'white';
c2.R[4] = 'orange';
c2.L[4] = 'red';
console.log('Case 2 (Center reassignment test):', solveWithCustomCenters(c2));
