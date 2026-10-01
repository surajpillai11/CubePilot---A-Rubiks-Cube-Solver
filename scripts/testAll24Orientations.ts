import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { cubeFromFaces, Faces, solve, formatAlgorithm } from '@turnwise/cube-solver';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';

const OPPOSITES: Record<CubeColor, CubeColor> = {
  white: 'yellow',
  yellow: 'white',
  green: 'blue',
  blue: 'green',
  red: 'orange',
  orange: 'red',
  empty: 'empty',
};

const TOP_FRONT_PAIRS: Array<[CubeColor, CubeColor, CubeColor]> = [
  ['white', 'green', 'red'],
  ['white', 'red', 'blue'],
  ['white', 'blue', 'orange'],
  ['white', 'orange', 'green'],
  ['yellow', 'green', 'orange'],
  ['yellow', 'orange', 'blue'],
  ['yellow', 'blue', 'red'],
  ['yellow', 'red', 'green'],
  ['green', 'white', 'orange'],
  ['green', 'orange', 'yellow'],
  ['green', 'yellow', 'red'],
  ['green', 'red', 'white'],
  ['blue', 'white', 'red'],
  ['blue', 'red', 'yellow'],
  ['blue', 'yellow', 'orange'],
  ['blue', 'orange', 'white'],
  ['red', 'white', 'green'],
  ['red', 'green', 'yellow'],
  ['red', 'yellow', 'blue'],
  ['red', 'blue', 'white'],
  ['orange', 'white', 'blue'],
  ['orange', 'blue', 'yellow'],
  ['orange', 'yellow', 'green'],
  ['orange', 'green', 'white'],
];

const ALL_24_ORIENTATIONS = TOP_FRONT_PAIRS.map(([top, front, right]) => ({
  U: top,
  F: front,
  R: right,
  L: OPPOSITES[right],
  B: OPPOSITES[front],
  D: OPPOSITES[top],
}));

export function findValidOrientation(cube: CubeFaceGrid) {
  for (let i = 0; i < ALL_24_ORIENTATIONS.length; i++) {
    const ori = ALL_24_ORIENTATIONS[i];
    const colorToFace: Record<string, any> = {
      [ori.U]: Faces.U,
      [ori.R]: Faces.R,
      [ori.F]: Faces.F,
      [ori.D]: Faces.D,
      [ori.L]: Faces.L,
      [ori.B]: Faces.B,
    };

    const grid = {
      U: cube.U.map((c) => colorToFace[c]),
      R: cube.R.map((c) => colorToFace[c]),
      F: cube.F.map((c) => colorToFace[c]),
      D: cube.D.map((c) => colorToFace[c]),
      L: cube.L.map((c) => colorToFace[c]),
      B: cube.B.map((c) => colorToFace[c]),
    };

    try {
      cubeFromFaces(grid as any);
      return { found: true, orientationIndex: i, orientation: ori };
    } catch {}
  }
  return { found: false };
}

// Now test!
// What if a user enters a cube held with Yellow on Top and Green on Front?
// On their physical cube:
// Face U had Yellow center!
// Face F had Green center!
// If they entered the stickers according to their cube:
const scramble = generateRandomScramble(15);
const validCube = applyMoves(createSolvedCube(), scramble.moves);

// Remap colors: swap white and yellow, swap red and orange (180 rotation)
const remapped = cloneCube(validCube);
const colorMap: Record<CubeColor, CubeColor> = {
  white: 'yellow',
  yellow: 'white',
  green: 'green',
  blue: 'blue',
  red: 'orange',
  orange: 'red',
  empty: 'empty',
};

const faces: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
for (const f of faces) {
  remapped[f] = remapped[f].map((c) => colorMap[c]);
}

console.log('Remapped cube (inverted):', findValidOrientation(remapped));
