import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';
import { CubeFaceGrid, FaceKey } from '../src/types/cube';

const isSolvable = (c: CubeFaceGrid): { solvable: boolean; error?: string } => {
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
    return { solvable: true };
  } catch (err: any) {
    return { solvable: false, error: `${err.constructor.name}: ${err.message}` };
  }
};

const scramble = generateRandomScramble(15);
const validCube = applyMoves(createSolvedCube(), scramble.moves);

console.log('Valid cube check:', isSolvable(validCube));

// Scenario 1: Back face flipped horizontally
const bFlipped = cloneCube(validCube);
// Flip B horizontally: 0<->2, 3<->5, 6<->8
for (let r = 0; r < 3; r++) {
  const tmp = bFlipped.B[r * 3 + 0];
  bFlipped.B[r * 3 + 0] = bFlipped.B[r * 3 + 2];
  bFlipped.B[r * 3 + 2] = tmp;
}
console.log('Scenario 1 (B flipped horiz):', isSolvable(bFlipped));

// Scenario 2: Down face rotated 180 deg
const dRot180 = cloneCube(validCube);
dRot180.D = [
  validCube.D[8], validCube.D[7], validCube.D[6],
  validCube.D[5], validCube.D[4], validCube.D[3],
  validCube.D[2], validCube.D[1], validCube.D[0],
];
console.log('Scenario 2 (D rotated 180):', isSolvable(dRot180));

// Scenario 3: Back face rotated 180 deg
const bRot180 = cloneCube(validCube);
bRot180.B = [
  validCube.B[8], validCube.B[7], validCube.B[6],
  validCube.B[5], validCube.B[4], validCube.B[3],
  validCube.B[2], validCube.B[1], validCube.B[0],
];
console.log('Scenario 3 (B rotated 180):', isSolvable(bRot180));

// Scenario 4: User held Red in front instead of Green (whole cube rotated around Y)
const yRotated = cloneCube(validCube);
// If user held Red in front:
// Their Front is Red, Right is Blue, Back is Orange, Left is Green, Top is White, Bottom is Yellow.
// But they entered into our fixed centers:
// F got Red face, R got Blue face, B got Orange face, L got Green face!
// Let's see:
console.log('Valid scramble centers:', validCube.U[4], validCube.F[4], validCube.R[4]);
