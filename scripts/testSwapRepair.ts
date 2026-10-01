import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { smartAutoFixCube } from './testSmartRepair';

const scramble = generateRandomScramble(20);
const scrambled = applyMoves(createSolvedCube(), scramble.moves);
// Swap two stickers: U[1] and F[3]
const broken = cloneCube(scrambled);
const tmp = broken.U[1];
broken.U[1] = broken.F[3];
broken.F[3] = tmp;

console.log('Testing swap repair on scrambled cube:');
const start = performance.now();
const repaired = smartAutoFixCube(broken);
const dur = Math.round(performance.now() - start);
console.log(`Repaired scrambled cube in ${dur}ms?`, repaired !== null);
