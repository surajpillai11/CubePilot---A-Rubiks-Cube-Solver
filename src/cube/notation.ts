import { FaceKey, MoveExplanation, StandardMove } from '../types/cube';

export const VALID_MOVES: StandardMove[] = [
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'L', "L'", 'L2',
  'R', "R'", 'R2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
];

export const FACE_NAMES: Record<FaceKey, string> = {
  U: 'Top (Up) Face',
  D: 'Bottom (Down) Face',
  L: 'Left Face',
  R: 'Right Face',
  F: 'Front Face',
  B: 'Back Face',
};

export const MOVE_EXPLANATIONS: Record<StandardMove, MoveExplanation> = {
  R: {
    move: 'R',
    face: 'R',
    faceName: 'Right Face',
    directionName: 'Clockwise (90°)',
    rotationAngleDeg: 90,
    rotationSymbol: '↻',
    shortDescription: 'Turn the RIGHT face clockwise',
    beginnerInstruction: 'Look directly at the right side of the cube and turn that entire layer 90° clockwise (away from you).',
    relativeTurnTips: 'With Green in front and White on top: turn the Red side away from you by 1/4 turn.',
  },
  "R'": {
    move: "R'",
    face: 'R',
    faceName: 'Right Face',
    directionName: 'Counter-Clockwise (90°)',
    rotationAngleDeg: -90,
    rotationSymbol: '↺',
    shortDescription: 'Turn the RIGHT face counter-clockwise',
    beginnerInstruction: 'Look directly at the right side of the cube and turn that entire layer 90° counter-clockwise (towards you).',
    relativeTurnTips: 'With Green in front and White on top: pull the Red side towards you by 1/4 turn.',
  },
  R2: {
    move: 'R2',
    face: 'R',
    faceName: 'Right Face',
    directionName: 'Half Turn (180°)',
    rotationAngleDeg: 180,
    rotationSymbol: '⟲',
    shortDescription: 'Turn the RIGHT face 180°',
    beginnerInstruction: 'Turn the right layer twice (a full 180° half turn in either direction).',
    relativeTurnTips: 'The top-right corner pieces will travel completely to the bottom-right.',
  },
  L: {
    move: 'L',
    face: 'L',
    faceName: 'Left Face',
    directionName: 'Clockwise (90°)',
    rotationAngleDeg: 90,
    rotationSymbol: '↻',
    shortDescription: 'Turn the LEFT face clockwise',
    beginnerInstruction: 'Look directly at the left face and rotate it 90° clockwise (towards you when viewed from front).',
    relativeTurnTips: 'With Green in front and White on top: pull the Orange side towards you by 1/4 turn.',
  },
  "L'": {
    move: "L'",
    face: 'L',
    faceName: 'Left Face',
    directionName: 'Counter-Clockwise (90°)',
    rotationAngleDeg: -90,
    rotationSymbol: '↺',
    shortDescription: 'Turn the LEFT face counter-clockwise',
    beginnerInstruction: 'Look directly at the left face and rotate it 90° counter-clockwise (away from you when viewed from front).',
    relativeTurnTips: 'With Green in front and White on top: push the Orange side away from you by 1/4 turn.',
  },
  L2: {
    move: 'L2',
    face: 'L',
    faceName: 'Left Face',
    directionName: 'Half Turn (180°)',
    rotationAngleDeg: 180,
    rotationSymbol: '⟲',
    shortDescription: 'Turn the LEFT face 180°',
    beginnerInstruction: 'Turn the left layer twice (a full 180° half turn).',
    relativeTurnTips: 'The top-left corner pieces travel to the bottom-left.',
  },
  U: {
    move: 'U',
    face: 'U',
    faceName: 'Top (Up) Face',
    directionName: 'Clockwise (90°)',
    rotationAngleDeg: 90,
    rotationSymbol: '↻',
    shortDescription: 'Turn the TOP face clockwise',
    beginnerInstruction: 'Look directly down onto the top face and rotate it 90° clockwise (to the left when viewed from front).',
    relativeTurnTips: 'Flick the top layer from right to left using your right index finger.',
  },
  "U'": {
    move: "U'",
    face: 'U',
    faceName: 'Top (Up) Face',
    directionName: 'Counter-Clockwise (90°)',
    rotationAngleDeg: -90,
    rotationSymbol: '↺',
    shortDescription: 'Turn the TOP face counter-clockwise',
    beginnerInstruction: 'Look directly down onto the top face and rotate it 90° counter-clockwise (to the right when viewed from front).',
    relativeTurnTips: 'Flick the top layer from left to right using your left index finger.',
  },
  U2: {
    move: 'U2',
    face: 'U',
    faceName: 'Top (Up) Face',
    directionName: 'Half Turn (180°)',
    rotationAngleDeg: 180,
    rotationSymbol: '⟲',
    shortDescription: 'Turn the TOP face 180°',
    beginnerInstruction: 'Turn the top layer 180° around (double turn).',
    relativeTurnTips: 'The front-top pieces will swap positions with the back-top pieces.',
  },
  D: {
    move: 'D',
    face: 'D',
    faceName: 'Bottom (Down) Face',
    directionName: 'Clockwise (90°)',
    rotationAngleDeg: 90,
    rotationSymbol: '↻',
    shortDescription: 'Turn the BOTTOM face clockwise',
    beginnerInstruction: 'Look at the bottom face from below and turn it 90° clockwise (to the right when viewed from front).',
    relativeTurnTips: 'Slide the bottom layer to the right using your right ring or pinky finger.',
  },
  "D'": {
    move: "D'",
    face: 'D',
    faceName: 'Bottom (Down) Face',
    directionName: 'Counter-Clockwise (90°)',
    rotationAngleDeg: -90,
    rotationSymbol: '↺',
    shortDescription: 'Turn the BOTTOM face counter-clockwise',
    beginnerInstruction: 'Look at the bottom face from below and turn it 90° counter-clockwise (to the left when viewed from front).',
    relativeTurnTips: 'Slide the bottom layer to the left using your left ring or pinky finger.',
  },
  D2: {
    move: 'D2',
    face: 'D',
    faceName: 'Bottom (Down) Face',
    directionName: 'Half Turn (180°)',
    rotationAngleDeg: 180,
    rotationSymbol: '⟲',
    shortDescription: 'Turn the BOTTOM face 180°',
    beginnerInstruction: 'Turn the bottom layer 180° around (double turn).',
    relativeTurnTips: 'The front-bottom pieces swap places with the back-bottom pieces.',
  },
  F: {
    move: 'F',
    face: 'F',
    faceName: 'Front Face',
    directionName: 'Clockwise (90°)',
    rotationAngleDeg: 90,
    rotationSymbol: '↻',
    shortDescription: 'Turn the FRONT face clockwise',
    beginnerInstruction: 'Look directly at the front face and turn it 90° clockwise like turning a steering wheel to the right.',
    relativeTurnTips: 'With Green in front: turn the green face clockwise by 1/4 turn.',
  },
  "F'": {
    move: "F'",
    face: 'F',
    faceName: 'Front Face',
    directionName: 'Counter-Clockwise (90°)',
    rotationAngleDeg: -90,
    rotationSymbol: '↺',
    shortDescription: 'Turn the FRONT face counter-clockwise',
    beginnerInstruction: 'Look directly at the front face and turn it 90° counter-clockwise like turning a steering wheel to the left.',
    relativeTurnTips: 'With Green in front: turn the green face counter-clockwise by 1/4 turn.',
  },
  F2: {
    move: 'F2',
    face: 'F',
    faceName: 'Front Face',
    directionName: 'Half Turn (180°)',
    rotationAngleDeg: 180,
    rotationSymbol: '⟲',
    shortDescription: 'Turn the FRONT face 180°',
    beginnerInstruction: 'Turn the front face 180° (upside down).',
    relativeTurnTips: 'The top row of the front face moves to the bottom row.',
  },
  B: {
    move: 'B',
    face: 'B',
    faceName: 'Back Face',
    directionName: 'Clockwise (90°)',
    rotationAngleDeg: 90,
    rotationSymbol: '↻',
    shortDescription: 'Turn the BACK face clockwise',
    beginnerInstruction: 'Look directly at the rear face from behind and turn it 90° clockwise.',
    relativeTurnTips: 'With Green in front: turn the Blue rear face 90° clockwise when viewed from behind.',
  },
  "B'": {
    move: "B'",
    face: 'B',
    faceName: 'Back Face',
    directionName: 'Counter-Clockwise (90°)',
    rotationAngleDeg: -90,
    rotationSymbol: '↺',
    shortDescription: 'Turn the BACK face counter-clockwise',
    beginnerInstruction: 'Look directly at the rear face from behind and turn it 90° counter-clockwise.',
    relativeTurnTips: 'With Green in front: turn the Blue rear face 90° counter-clockwise when viewed from behind.',
  },
  B2: {
    move: 'B2',
    face: 'B',
    faceName: 'Back Face',
    directionName: 'Half Turn (180°)',
    rotationAngleDeg: 180,
    rotationSymbol: '⟲',
    shortDescription: 'Turn the BACK face 180°',
    beginnerInstruction: 'Turn the back face 180° (a full half-turn).',
    relativeTurnTips: 'The top row of the back face moves to the bottom row.',
  },
};

/**
 * Returns inverse move (e.g. R -> R', R' -> R, R2 -> R2)
 */
export function getInverseMove(move: StandardMove): StandardMove {
  if (move.endsWith('2')) return move;
  if (move.endsWith("'")) return move.slice(0, 1) as StandardMove;
  return `${move}'` as StandardMove;
}

/**
 * Parses space-separated move string into valid StandardMove array
 */
export function parseMoveString(str: string): StandardMove[] {
  if (!str || !str.trim()) return [];
  const tokens = str.trim().split(/\s+/);
  const moves: StandardMove[] = [];
  for (const token of tokens) {
    const clean = token.replace(/[\(\)\[\]]/g, '');
    if (VALID_MOVES.includes(clean as StandardMove)) {
      moves.push(clean as StandardMove);
    }
  }
  return moves;
}

/**
 * Formats move sequence as clean notation string
 */
export function formatMoves(moves: StandardMove[]): string {
  return moves.join(' ');
}
