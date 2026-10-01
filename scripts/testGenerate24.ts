import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';
import { rotateCubeX, rotateCubeY, rotateCubeZ } from './testWholeCubeRotations';

export function getAll24CubeRotations(cube: CubeFaceGrid): CubeFaceGrid[] {
  const result: CubeFaceGrid[] = [];
  const visited = new Set<string>();

  const queue: CubeFaceGrid[] = [cloneCube(cube)];
  const hash = (c: CubeFaceGrid) => `${c.U[4]}-${c.F[4]}-${c.R[4]}`;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const key = hash(curr);
    if (!visited.has(key)) {
      visited.add(key);
      result.push(curr);

      queue.push(rotateCubeX(curr));
      queue.push(rotateCubeY(curr));
      queue.push(rotateCubeZ(curr));
    }
  }

  return result;
}

const solved = createSolvedCube();
const all24 = getAll24CubeRotations(solved);
console.log('Found total orientations:', all24.length);
all24.forEach((c, i) => {
  console.log(`Ori ${i+1}: Top=${c.U[4]}, Front=${c.F[4]}, Right=${c.R[4]}`);
});
