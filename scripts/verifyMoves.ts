import { createSolvedCube, applyMove } from '../src/cube/CubeState';
import { cubeFromMoves, facesFromCube } from '@turnwise/cube-solver';

const faceKeys = ['U', 'D', 'L', 'R', 'F', 'B'] as const;
const colorToFace: Record<string, string> = {
  white: 'U',
  yellow: 'D',
  orange: 'L',
  red: 'R',
  green: 'F',
  blue: 'B',
};

let anyMismatch = false;

for (const m of faceKeys) {
  const ourGrid = applyMove(createSolvedCube(), m);
  const csGrid = facesFromCube(cubeFromMoves([m as any]));
  let mismatchForM = false;
  for (const f of faceKeys) {
    for (let i = 0; i < 9; i++) {
      const ourF = colorToFace[ourGrid[f][i]];
      const csF = csGrid[f][i];
      if (ourF !== csF) {
        console.log(`Mismatch on move ${m}: face ${f}[${i}] our=${ourF} cs=${csF}`);
        mismatchForM = true;
        anyMismatch = true;
      }
    }
  }
  if (!mismatchForM) {
    console.log(`Move ${m} MATCHES exactly!`);
  }
}

if (!anyMismatch) {
  console.log('ALL 6 MOVES MATCH CUBE-SOLVER PERFECTLY!');
}
