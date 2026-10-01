import { createSolvedCube, cloneCube, applyMoves, generateRandomScramble } from '../src/cube/CubeState';
import { CubeFaceGrid, FaceKey, CubeColor } from '../src/types/cube';
import { cubeFromFaces, Faces } from '@turnwise/cube-solver';

const OPPOSITES: Record<CubeColor, CubeColor> = {
  white: 'yellow', yellow: 'white',
  green: 'blue', blue: 'green',
  red: 'orange', orange: 'red',
  empty: 'empty',
};

const TOP_FRONT_PAIRS: Array<[CubeColor, CubeColor, CubeColor]> = [
  ['white', 'green', 'red'], ['white', 'red', 'blue'], ['white', 'blue', 'orange'], ['white', 'orange', 'green'],
  ['yellow', 'green', 'orange'], ['yellow', 'orange', 'blue'], ['yellow', 'blue', 'red'], ['yellow', 'red', 'green'],
  ['green', 'white', 'orange'], ['green', 'orange', 'yellow'], ['green', 'yellow', 'red'], ['green', 'red', 'white'],
  ['blue', 'white', 'red'], ['blue', 'red', 'yellow'], ['blue', 'yellow', 'orange'], ['blue', 'orange', 'white'],
  ['red', 'white', 'green'], ['red', 'green', 'yellow'], ['red', 'yellow', 'blue'], ['red', 'blue', 'white'],
  ['orange', 'white', 'blue'], ['orange', 'blue', 'yellow'], ['orange', 'yellow', 'green'], ['orange', 'green', 'white'],
];

const ALL_24_ORIENTATIONS = TOP_FRONT_PAIRS.map(([top, front, right]) => ({
  U: top, F: front, R: right,
  L: OPPOSITES[right], B: OPPOSITES[front], D: OPPOSITES[top],
}));

function fixOrientation(cube: CubeFaceGrid): CubeFaceGrid | null {
  for (const ori of ALL_24_ORIENTATIONS) {
    try {
      const colorToFace: Record<string, any> = {
        [ori.U]: Faces.U,
        [ori.R]: Faces.R,
        [ori.F]: Faces.F,
        [ori.D]: Faces.D,
        [ori.L]: Faces.L,
        [ori.B]: Faces.B,
      };

      // In this orientation, the centers of the faces are ori.U, ori.R, etc.
      // So the center of U must be mapped to ori.U, not the old center!
      const candidate = cloneCube(cube);
      candidate.U[4] = ori.U;
      candidate.F[4] = ori.F;
      candidate.R[4] = ori.R;
      candidate.D[4] = ori.D;
      candidate.L[4] = ori.L;
      candidate.B[4] = ori.B;

      const grid = {
        U: candidate.U.map((c) => colorToFace[c]),
        R: candidate.R.map((c) => colorToFace[c]),
        F: candidate.F.map((c) => colorToFace[c]),
        D: candidate.D.map((c) => colorToFace[c]),
        L: candidate.L.map((c) => colorToFace[c]),
        B: candidate.B.map((c) => colorToFace[c]),
      };

      cubeFromFaces(grid as any);
      console.log('Matched orientation:', ori);
      return candidate;
    } catch (err: any) {
      // console.log('Ori failed:', err.message);
    }
  }
  return null;
}

const scramble = generateRandomScramble(20);
const valid = applyMoves(createSolvedCube(), scramble.moves);

// Upside down cube test:
// On physical cube: Yellow is Top, Green is Front, Orange is Right, White is Down, Red is Left, Blue is Back.
// User painted their cube into the net:
// Top face got Yellow stickers
// Front face got Green stickers
// Right face got Orange stickers
// Down face got White stickers
// Left face got Red stickers
// Back face got Blue stickers
// But centers in our app were locked to standard: U=white, D=yellow, L=orange, R=red, F=green, B=blue!
const upsideDownCube = cloneCube(valid);
const tmpU = upsideDownCube.U; upsideDownCube.U = upsideDownCube.D; upsideDownCube.D = tmpU;
const tmpL = upsideDownCube.L; upsideDownCube.L = upsideDownCube.R; upsideDownCube.R = tmpL;

// Locked centers in app were:
upsideDownCube.U[4] = 'white';
upsideDownCube.D[4] = 'yellow';
upsideDownCube.L[4] = 'orange';
upsideDownCube.R[4] = 'red';
upsideDownCube.F[4] = 'green';
upsideDownCube.B[4] = 'blue';

console.log('Testing fixOrientation on upsideDownCube:');
const fixed = fixOrientation(upsideDownCube);
console.log('Result:', fixed !== null);
