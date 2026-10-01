import { cubeFromFaces, Faces } from '@turnwise/cube-solver';

const grid: any = {
  U: Array(9).fill(Faces.U),
  R: Array(9).fill(Faces.R),
  F: Array(9).fill(Faces.F),
  D: Array(9).fill(Faces.D),
  L: Array(9).fill(Faces.L),
  B: Array(9).fill(Faces.B),
};

// Swap F[2] (corner U-F-R) with B[0]
grid.F[2] = Faces.B;
grid.B[0] = Faces.F;

try {
  cubeFromFaces(grid);
} catch (e: any) {
  console.log(`${e.name}: ${e.message}`);
}
