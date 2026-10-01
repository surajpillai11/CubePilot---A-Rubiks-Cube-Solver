import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble, autoFixCubeParity } from '../src/cube/CubeState';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';

const scramble = generateRandomScramble(20);
const valid = applyMoves(createSolvedCube(), scramble.moves);

// Test 1: User inverted Back face (both H and V flipped, i.e. 180 rotation)
const t1 = cloneCube(valid);
t1.B = [
  valid.B[8], valid.B[7], valid.B[6],
  valid.B[5], valid.B[4], valid.B[3],
  valid.B[2], valid.B[1], valid.B[0],
];
console.log('Test 1 (B 180):', autoFixCubeParity(t1) !== null);

// Test 2: User rotated D by 90 deg AND B flipped
const t2 = cloneCube(valid);
t2.D = [
  valid.D[6], valid.D[3], valid.D[0],
  valid.D[7], valid.D[4], valid.D[1],
  valid.D[8], valid.D[5], valid.D[2],
];
t2.B = [
  valid.B[2], valid.B[1], valid.B[0],
  valid.B[5], valid.B[4], valid.B[3],
  valid.B[8], valid.B[7], valid.B[6],
];
console.log('Test 2 (D 90 + B flipH):', autoFixCubeParity(t2) !== null);

// Test 3: What if user painted the cube holding it upside down (Yellow top, White bottom)?
// If user held Yellow on top and Green in front:
// Their U is Yellow, D is White, F is Green, B is Blue, L is Red, R is Orange.
// But our centers are U=white, D=yellow, F=green, B=blue, L=orange, R=red!
// When they painted Yellow into U:
const t3 = cloneCube(valid);
// Swap all U and D
const tmpU = t3.U; t3.U = t3.D; t3.D = tmpU;
// And swap all L and R
const tmpL = t3.L; t3.L = t3.R; t3.R = tmpL;
console.log('Test 3 (Upside down cube):', autoFixCubeParity(t3) !== null);

// Test 4: What if user held Green on top and White in front?
// That's an orientation where U is Green and F is White.
const t4 = cloneCube(valid);
// What if user entered their physical cube with Green on top, White in front, etc.
// But in our app, the centers were locked to White, Yellow, etc.
// If the user painted their stickers:
// They painted into U what they saw on top (Green).
// Let's see if autoFixCubeParity can fix that:
console.log('Test 4 (Re-orientation test):', autoFixCubeParity(t4) !== null);
