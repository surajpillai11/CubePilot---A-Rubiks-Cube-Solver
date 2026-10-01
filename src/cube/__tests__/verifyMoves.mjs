function rotateFaceCW(f) {
  return [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]];
}

function applySingleCW(s, m) {
  s[m] = rotateFaceCW(s[m]);
  if (m === 'U') {
    const tmp = [s.F[0], s.F[1], s.F[2]];
    s.F[0] = s.R[0]; s.F[1] = s.R[1]; s.F[2] = s.R[2];
    s.R[0] = s.B[0]; s.R[1] = s.B[1]; s.R[2] = s.B[2];
    s.B[0] = s.L[0]; s.B[1] = s.L[1]; s.B[2] = s.L[2];
    s.L[0] = tmp[0]; s.L[1] = tmp[1]; s.L[2] = tmp[2];
  } else if (m === 'D') {
    const tmp = [s.F[6], s.F[7], s.F[8]];
    s.F[6] = s.L[6]; s.F[7] = s.L[7]; s.F[8] = s.L[8];
    s.L[6] = s.B[6]; s.L[7] = s.B[7]; s.L[8] = s.B[8];
    s.B[6] = s.R[6]; s.B[7] = s.R[7]; s.B[8] = s.R[8];
    s.R[6] = tmp[0]; s.R[7] = tmp[1]; s.R[8] = tmp[2];
  } else if (m === 'L') {
    const tmp = [s.U[0], s.U[3], s.U[6]];
    s.U[0] = s.B[8]; s.U[3] = s.B[5]; s.U[6] = s.B[2];
    s.B[8] = s.D[0]; s.B[5] = s.D[3]; s.B[2] = s.D[6];
    s.D[0] = s.F[0]; s.D[3] = s.F[3]; s.D[6] = s.F[6];
    s.F[0] = tmp[0]; s.F[3] = tmp[1]; s.F[6] = tmp[2];
  } else if (m === 'R') {
    const tmp = [s.U[2], s.U[5], s.U[8]];
    s.U[2] = s.F[2]; s.U[5] = s.F[5]; s.U[8] = s.F[8];
    s.F[2] = s.D[2]; s.F[5] = s.D[5]; s.F[8] = s.D[8];
    s.D[2] = s.B[6]; s.D[5] = s.B[3]; s.D[8] = s.B[0];
    s.B[6] = tmp[0]; s.B[3] = tmp[1]; s.B[0] = tmp[2];
  } else if (m === 'F') {
    const tmp = [s.U[6], s.U[7], s.U[8]];
    s.U[6] = s.L[8]; s.U[7] = s.L[5]; s.U[8] = s.L[2];
    s.L[2] = s.D[0]; s.L[5] = s.D[1]; s.L[8] = s.D[2];
    s.D[0] = s.R[6]; s.D[1] = s.R[3]; s.D[2] = s.R[0];
    s.R[0] = tmp[0]; s.R[3] = tmp[1]; s.R[6] = tmp[2];
  } else if (m === 'B') {
    const tmp = [s.U[0], s.U[1], s.U[2]];
    s.U[0] = s.R[2]; s.U[1] = s.R[5]; s.U[2] = s.R[8];
    s.R[2] = s.D[8]; s.R[5] = s.D[7]; s.R[8] = s.D[6];
    s.D[6] = s.L[0]; s.D[7] = s.L[3]; s.D[8] = s.L[6];
    s.L[0] = tmp[2]; s.L[3] = tmp[1]; s.L[6] = tmp[0];
  }
}

export function applyMovePure(state, move) {
  const s = {
    U: [...state.U],
    D: [...state.D],
    L: [...state.L],
    R: [...state.R],
    F: [...state.F],
    B: [...state.B],
  };
  const m = move[0];
  const isPrime = move.endsWith("'");
  const isDouble = move.endsWith('2');
  const count = isDouble ? 2 : isPrime ? 3 : 1;
  for (let step = 0; step < count; step++) {
    applySingleCW(s, m);
  }
  return s;
}

const solved = {
  U: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'U' + i),
  D: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'D' + i),
  L: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'L' + i),
  R: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'R' + i),
  F: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'F' + i),
  B: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'B' + i),
};

let allPassed = true;
['U', 'D', 'L', 'R', 'F', 'B'].forEach((m) => {
  let s = solved;
  for (let i = 0; i < 4; i++) s = applyMovePure(s, m);
  const ok4 = JSON.stringify(s) === JSON.stringify(solved);

  const sInv = applyMovePure(applyMovePure(solved, m), m + "'");
  const okInv = JSON.stringify(sInv) === JSON.stringify(solved);

  const s2 = applyMovePure(applyMovePure(solved, m + '2'), m + '2');
  const ok2 = JSON.stringify(s2) === JSON.stringify(solved);

  console.log(m, '4x:', ok4, "m+m':", okInv, '2x2:', ok2);
  if (!ok4 || !okInv || !ok2) allPassed = false;
});

console.log('All tests passed:', allPassed);
