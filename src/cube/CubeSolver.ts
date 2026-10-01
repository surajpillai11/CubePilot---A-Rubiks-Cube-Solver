import {
  cubeFromFaces,
  Faces,
  formatAlgorithm,
  prepare,
  solve as solveKociemba,
} from '@turnwise/cube-solver';
import { CubeFaceGrid, Solution, SolutionStep, StandardMove } from '../types/cube';
import { autoFixCubeParity, isCubeSolved } from './CubeState';
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

    let targetCube = cube;
    let kCube: any = null;
    let repaired = false;

    const buildSolverGrid = (c: CubeFaceGrid) => {
      const colorToFace: Record<string, any> = {
        [c.U[4]]: Faces.U,
        [c.R[4]]: Faces.R,
        [c.F[4]]: Faces.F,
        [c.D[4]]: Faces.D,
        [c.L[4]]: Faces.L,
        [c.B[4]]: Faces.B,
      };

      return {
        U: c.U.map((col) => colorToFace[col]),
        R: c.R.map((col) => colorToFace[col]),
        F: c.F.map((col) => colorToFace[col]),
        D: c.D.map((col) => colorToFace[col]),
        L: c.L.map((col) => colorToFace[col]),
        B: c.B.map((col) => colorToFace[col]),
      };
    };

    try {
      const grid = buildSolverGrid(targetCube);
      kCube = cubeFromFaces(grid as any);
    } catch (primaryErr) {
      // Automatic smart repair fallback
      const fixed = autoFixCubeParity(cube);
      if (fixed) {
        targetCube = fixed;
        repaired = true;
        const grid = buildSolverGrid(targetCube);
        kCube = cubeFromFaces(grid as any);
      } else {
        throw primaryErr;
      }
    }

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
      repairedCube: repaired ? targetCube : undefined,
    };
  }
}

export const defaultSolver = new KociembaCubeSolver();
