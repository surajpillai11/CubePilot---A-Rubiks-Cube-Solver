import {
  cubeFromFaces,
  Faces,
  formatAlgorithm,
  prepare,
  solve as solveKociemba,
} from '@turnwise/cube-solver';
import { CubeFaceGrid, Solution, SolutionStep, StandardMove } from '../types/cube';
import { isCubeSolved } from './CubeState';
import { MOVE_EXPLANATIONS, parseMoveString } from './notation';

// Warm up tables in background once module loads
let prepared = false;
export function prewarmSolver(): void {
  if (prepared) return;
  try {
    prepare();
    prepared = true;
  } catch (err) {
    console.warn('Prewarming cube solver tables:', err);
  }
}

// Automatically initiate background warmup
setTimeout(prewarmSolver, 100);

export class KociembaCubeSolver {
  async solve(cube: CubeFaceGrid): Promise<Solution> {
    const startTime = performance.now();

    // 1. Check if already solved
    if (isCubeSolved(cube)) {
      return {
        moves: [],
        steps: [],
        moveCount: 0,
        estimatedSolveTimeMs: 0,
        algorithmString: '',
      };
    }

    // 2. Map colors to faces by center assignment
    const colorToFace: Record<string, any> = {
      [cube.U[4]]: Faces.U,
      [cube.R[4]]: Faces.R,
      [cube.F[4]]: Faces.F,
      [cube.D[4]]: Faces.D,
      [cube.L[4]]: Faces.L,
      [cube.B[4]]: Faces.B,
    };

    const solverGrid: any = {
      U: cube.U.map((c) => colorToFace[c]),
      R: cube.R.map((c) => colorToFace[c]),
      F: cube.F.map((c) => colorToFace[c]),
      D: cube.D.map((c) => colorToFace[c]),
      L: cube.L.map((c) => colorToFace[c]),
      B: cube.B.map((c) => colorToFace[c]),
    };

    const kCube = cubeFromFaces(solverGrid);
    const rawSolutionMoves = solveKociemba(kCube);
    const algorithmString = formatAlgorithm(rawSolutionMoves);
    const moves = parseMoveString(algorithmString);

    const steps: SolutionStep[] = moves.map((move, index) => {
      return {
        index,
        move,
        explanation: MOVE_EXPLANATIONS[move],
        phase: 'kociemba',
      };
    });

    const elapsed = Math.round(performance.now() - startTime);

    return {
      moves,
      steps,
      moveCount: moves.length,
      estimatedSolveTimeMs: elapsed,
      algorithmString,
    };
  }
}

export const defaultSolver = new KociembaCubeSolver();
