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

const scramble = generateRandomScramble(25);
const valid = applyMoves(createSolvedCube(), scramble.moves);

// Take any of the 24 orientations of this scrambled cube
const allOrientations = getAll24CubeRotations(valid);

for (let i = 0; i < allOrientations.length; i++) {
  const rotated = allOrientations[i];
  const solvable = isSolvable(rotated);
  if (!solvable) {
    console.error(`Orientation ${i} is not solvable!`);
  }
}
console.log('All 24 orientations of scrambled cube tested! Solvable count:', allOrientations.filter(isSolvable).length);
