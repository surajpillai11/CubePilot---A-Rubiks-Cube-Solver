import { createSolvedCube, cloneCube } from '../src/cube/CubeState';
import { autoFixCubeParity } from '../src/cube/CubeState';
import { validateCubeState } from '../src/cube/CubeValidator';

const edgeDefs = [
  { name: 'UR', s: [{ f: 'U', i: 5 }, { f: 'R', i: 1 }] },
  { name: 'UF', s: [{ f: 'U', i: 7 }, { f: 'F', i: 1 }] },
  { name: 'UL', s: [{ f: 'U', i: 3 }, { f: 'L', i: 1 }] },
  { name: 'UB', s: [{ f: 'U', i: 1 }, { f: 'B', i: 1 }] },
  { name: 'DR', s: [{ f: 'D', i: 5 }, { f: 'R', i: 7 }] },
  { name: 'DF', s: [{ f: 'D', i: 1 }, { f: 'F', i: 7 }] },
  { name: 'DL', s: [{ f: 'D', i: 3 }, { f: 'L', i: 7 }] },
  { name: 'DB', s: [{ f: 'D', i: 7 }, { f: 'B', i: 7 }] },
  { name: 'FR', s: [{ f: 'F', i: 5 }, { f: 'R', i: 3 }] },
  { name: 'FL', s: [{ f: 'F', i: 3 }, { f: 'L', i: 5 }] },
  { name: 'BL', s: [{ f: 'B', i: 5 }, { f: 'L', i: 3 }] },
  { name: 'BR', s: [{ f: 'B', i: 3 }, { f: 'R', i: 5 }] },
];

console.log('--- Testing autoFix on 12 edge flips ---');
for (const edge of edgeDefs) {
  const cube = cloneCube(createSolvedCube());
  // Flip edge
  const tmp = cube[edge.s[0].f][edge.s[0].i];
  cube[edge.s[0].f][edge.s[0].i] = cube[edge.s[1].f][edge.s[1].i];
  cube[edge.s[1].f][edge.s[1].i] = tmp;

  const fixed = autoFixCubeParity(cube);
  console.log(`Edge ${edge.name} flip fix: ${fixed ? 'SUCCESS' : 'FAILED'}`);
}
