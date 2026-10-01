import { createSolvedCube, applyMove, applyMoves, generateRandomScramble, cloneCube } from '../src/cube/CubeState';
import { defaultSolver } from '../src/cube/CubeSolver';
import { validateCubeState } from '../src/cube/CubeValidator';

async function test() {
  console.log('--- Testing standard scrambles ---');
  for (let i = 0; i < 5; i++) {
    const scramble = generateRandomScramble(20);
    const scrambled = applyMoves(createSolvedCube(), scramble.moves);
    const val = validateCubeState(scrambled);
    if (!val.isValid) {
      console.error(`Scramble ${i} invalid!`, val.errorTitle, val.errorMessage);
    } else {
      const sol = await defaultSolver.solve(scrambled);
      console.log(`Scramble ${i} solved in ${sol.moveCount} moves! Alg: ${sol.algorithmString}`);
    }
  }
}

test().catch(console.error);
