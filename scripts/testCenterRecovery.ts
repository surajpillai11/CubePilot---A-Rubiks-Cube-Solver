import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';
import { getAll24CubeRotations } from './testGenerate24';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';

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

const scramble = generateRandomScramble(20);
const valid = applyMoves(createSolvedCube(), scramble.moves);
const all24 = getAll24CubeRotations(valid);

// Pick a rotated orientation, e.g. orientation #5 (Top=yellow, Front=blue, Right=red)
const rotatedCube = all24[4];
console.log('Original centers of rotatedCube:', {
  U: rotatedCube.U[4],
  F: rotatedCube.F[4],
  R: rotatedCube.R[4],
  D: rotatedCube.D[4],
  L: rotatedCube.L[4],
  B: rotatedCube.B[4],
});

// Now simulate user entering this into our app where centers were locked to standard:
const userEnteredCube = cloneCube(rotatedCube);
userEnteredCube.U[4] = 'white';
userEnteredCube.F[4] = 'green';
userEnteredCube.R[4] = 'red';
userEnteredCube.D[4] = 'yellow';
userEnteredCube.L[4] = 'orange';
userEnteredCube.B[4] = 'blue';

console.log('User entered cube with locked centers solvable?', isSolvable(userEnteredCube));

// Can we recover it by testing all 24 center sets?
// The 24 center sets are given by the centers of all24:
const solvedRotations = getAll24CubeRotations(createSolvedCube());
const all24Centers = solvedRotations.map(c => ({
  U: c.U[4], F: c.F[4], R: c.R[4], D: c.D[4], L: c.L[4], B: c.B[4]
}));

let recovered = false;
for (const centers of all24Centers) {
  const candidate = cloneCube(userEnteredCube);
  candidate.U[4] = centers.U;
  candidate.F[4] = centers.F;
  candidate.R[4] = centers.R;
  candidate.D[4] = centers.D;
  candidate.L[4] = centers.L;
  candidate.B[4] = centers.B;

  if (isSolvable(candidate)) {
    console.log('RECOVERED SUCCESSFULLY with centers:', centers);
    recovered = true;
    break;
  }
}
console.log('Recovery result:', recovered);
