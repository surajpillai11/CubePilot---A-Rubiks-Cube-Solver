import {
  createSolvedCube,
  cloneCube,
  applyMove,
  applyMoves,
  isCubeSolved,
  generateRandomScramble,
  PRESET_PATTERNS,
} from '../CubeState.ts';
import { validateCubeState } from '../CubeValidator.ts';
import { KociembaCubeSolver } from '../CubeSolver.ts';
import { getInverseMove, parseMoveString } from '../notation.ts';

async function runTests() {
  console.log('🧪 Running Cube Engine Test Suite...\n');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failCount++;
    }
  }

  // 1. Solved state properties
  const solved = createSolvedCube();
  assert(isCubeSolved(solved), 'Initial cube is recognized as solved');

  // 2. Identity and Inversion tests for all 6 faces
  const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
  for (const f of faces) {
    // 4 quarter turns = solved
    const turned4 = applyMoves(solved, [f, f, f, f]);
    assert(isCubeSolved(turned4), `${f} x 4 returns to solved state`);

    // Move + Inverse = solved
    const inv = getInverseMove(f);
    const turnedInv = applyMoves(solved, [f, inv]);
    assert(isCubeSolved(turnedInv), `${f} + ${inv} returns to solved state`);

    // Double turn + Double turn = solved
    const dbl = `${f}2`;
    const turnedDbl = applyMoves(solved, [dbl, dbl]);
    assert(isCubeSolved(turnedDbl), `${dbl} + ${dbl} returns to solved state`);
  }

  // 3. Validation tests
  // Valid solved cube
  const valSolved = validateCubeState(solved);
  assert(valSolved.isValid, 'Solved cube validates as valid');

  // Invalid sticker counts (replace a white sticker with yellow)
  const invalidCounts = cloneCube(solved);
  invalidCounts.U[0] = 'yellow';
  const valCounts = validateCubeState(invalidCounts);
  assert(!valCounts.isValid && valCounts.errorTitle === 'Incorrect Sticker Counts', 'Sticker count mismatch is correctly detected');

  // Invalid center duplicate
  const duplicateCenter = cloneCube(solved);
  duplicateCenter.U[4] = 'yellow';
  const valCenter = validateCubeState(duplicateCenter);
  assert(!valCenter.isValid && valCenter.errorTitle === 'Duplicate Center Colors', 'Duplicate center is correctly detected');

  // Impossible twisted corner
  const twistedCorner = cloneCube(solved);
  // URF corner stickers: U[8], R[0], F[2]
  twistedCorner.U[8] = 'red';
  twistedCorner.R[0] = 'green';
  twistedCorner.F[2] = 'white';
  const valTwist = validateCubeState(twistedCorner);
  assert(!valTwist.isValid && valTwist.errorTitle?.includes('Corner Twist'), 'Single corner twist is correctly identified');

  // 4. Solver tests: Generate scrambles and solve them
  const solver = new KociembaCubeSolver();

  // Test 1: Sexy move scramble
  const sexyMoves = ['R', 'U', "R'", "U'"];
  const sexyCube = applyMoves(solved, sexyMoves);
  const sexySolution = await solver.solve(sexyCube);
  assert(sexySolution.moves.length > 0, `Sexy move solved in ${sexySolution.moves.length} moves (${sexySolution.algorithmString})`);
  const solvedFromSexy = applyMoves(sexyCube, sexySolution.moves);
  assert(isCubeSolved(solvedFromSexy), 'Applying solution to Sexy move cube yields fully solved cube');

  // Test 2: Random scramble solve
  const scrambleObj = generateRandomScramble(15);
  const scrambledCube = applyMoves(solved, scrambleObj.moves);
  assert(!isCubeSolved(scrambledCube), 'Scrambled cube is not solved');
  const scrambleSolution = await solver.solve(scrambledCube);
  assert(scrambleSolution.moves.length > 0, `Random scramble solved in ${scrambleSolution.moves.length} moves`);
  const solvedFromScramble = applyMoves(scrambledCube, scrambleSolution.moves);
  assert(isCubeSolved(solvedFromScramble), 'Applying solution to randomly scrambled cube yields fully solved cube');

  // Test 3: Checkerboard preset pattern solve
  const checkerMoves = PRESET_PATTERNS[0].moves;
  const checkerCube = applyMoves(solved, checkerMoves);
  const checkerSolution = await solver.solve(checkerCube);
  const solvedFromChecker = applyMoves(checkerCube, checkerSolution.moves);
  assert(isCubeSolved(solvedFromChecker), 'Checkerboard pattern is successfully solved back to solved state');

  console.log(`\nResults: ${passCount} passed, ${failCount} failed.`);
  if (failCount > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
