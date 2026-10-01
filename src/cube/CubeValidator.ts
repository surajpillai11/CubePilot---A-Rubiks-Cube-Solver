import {
  cubeFromFaces,
  StickerCountError,
  UnknownPieceError,
  DuplicatePieceError,
  CornerTwistError,
  EdgeFlipError,
  ParityError,
  Faces,
} from '@turnwise/cube-solver';
import { CubeColor, CubeFaceGrid, FaceKey, ValidationResult } from '../types/cube';
import { autoFixCubeParity } from './CubeState';

export function countStickers(cube: CubeFaceGrid): Record<CubeColor, number> {
  const counts: Record<CubeColor, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    green: 0,
    blue: 0,
    empty: 0,
  };

  const faces: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  for (const f of faces) {
    for (let i = 0; i < 9; i++) {
      const color = cube[f][i];
      if (counts[color] !== undefined) {
        counts[color]++;
      }
    }
  }

  return counts;
}

export function validateCubeState(cube: CubeFaceGrid): ValidationResult {
  const colorCounts = countStickers(cube);
  const emptyCount = colorCounts.empty || 0;

  // 1. If cube has unpainted stickers, it is in progress
  if (emptyCount > 0) {
    const filledCount = 54 - emptyCount;
    return {
      isValid: false,
      isComplete: false,
      emptyCount,
      colorCounts,
      errorTitle: 'Painting in Progress',
      errorMessage: `You have painted ${filledCount} of 54 stickers. Please fill the remaining ${emptyCount} blank stickers.`,
      suggestedFix: 'Select a color from the palette and click the blank (+) stickers on the net.',
    };
  }

  // 2. Verify Center Stickers are 6 unique colors
  const centers: Record<FaceKey, CubeColor> = {
    U: cube.U[4],
    D: cube.D[4],
    L: cube.L[4],
    R: cube.R[4],
    F: cube.F[4],
    B: cube.B[4],
  };

  const uniqueCenterColors = new Set(Object.values(centers));
  if (uniqueCenterColors.has('empty') || uniqueCenterColors.size < 6) {
    return {
      isValid: false,
      isComplete: true,
      emptyCount: 0,
      colorCounts,
      errorTitle: 'Duplicate Center Colors',
      errorMessage:
        'The center stickers (middle piece of each 3x3 face) define the face colors and must all be 6 distinct colors (White, Yellow, Green, Blue, Red, Orange).',
      suggestedFix: 'Click "Auto-Fill Centers" to reset standard center colors.',
      highlightedStickers: [
        { face: 'U', index: 4 },
        { face: 'D', index: 4 },
        { face: 'L', index: 4 },
        { face: 'R', index: 4 },
        { face: 'F', index: 4 },
        { face: 'B', index: 4 },
      ],
    };
  }

  // 3. Verify Sticker Counts (exactly 9 of each of the 6 colors)
  const standardColors: CubeColor[] = ['white', 'yellow', 'red', 'orange', 'green', 'blue'];
  const countErrors: string[] = [];
  for (const color of standardColors) {
    const count = colorCounts[color] || 0;
    if (count !== 9) {
      const diff = count - 9;
      const capColor = color.charAt(0).toUpperCase() + color.slice(1);
      countErrors.push(`${capColor} appears ${count} times (${diff > 0 ? `+${diff}` : `${diff}`})`);
    }
  }

  if (countErrors.length > 0) {
    // Check if smart auto fix can repair 1-sticker count typo
    let canAutoFix = false;
    try {
      canAutoFix = autoFixCubeParity(cube) !== null;
    } catch {}

    return {
      isValid: false,
      isComplete: true,
      emptyCount: 0,
      colorCounts,
      errorTitle: 'Incorrect Sticker Counts',
      errorMessage: `Every color must appear exactly 9 times on the cube. Currently:\n• ${countErrors.join('\n• ')}`,
      suggestedFix: canAutoFix
        ? 'Click "Auto-Fix & Solve" to let CubePilot resolve the typo, or correct sticker counts manually.'
        : 'Inspect the highlighted stickers and correct the counts so each color has 9 stickers.',
      canAutoFix,
    };
  }

  // 4. Structural Validity using Kociemba mathematical checks
  const colorToFace: Record<string, any> = {
    [centers.U]: Faces.U,
    [centers.R]: Faces.R,
    [centers.F]: Faces.F,
    [centers.D]: Faces.D,
    [centers.L]: Faces.L,
    [centers.B]: Faces.B,
  };

  try {
    const solverGrid: any = {
      U: cube.U.map((c) => colorToFace[c]),
      R: cube.R.map((c) => colorToFace[c]),
      F: cube.F.map((c) => colorToFace[c]),
      D: cube.D.map((c) => colorToFace[c]),
      L: cube.L.map((c) => colorToFace[c]),
      B: cube.B.map((c) => colorToFace[c]),
    };

    cubeFromFaces(solverGrid);

    return {
      isValid: true,
      isComplete: true,
      emptyCount: 0,
      colorCounts,
    };
  } catch (error: any) {
    let errorTitle = 'Invalid Cube Configuration';
    let errorMessage = error.message || 'The entered configuration is physically impossible to solve.';
    let suggestedFix = 'Check your physical cube to ensure stickers are placed accurately.';
    let canAutoFix = false;

    if (error instanceof CornerTwistError) {
      errorTitle = 'Corner Twist Detected';
      errorMessage =
        'One corner is twisted in place. On a physical Rubik\'s Cube, this happens if a corner piece was rotated by hand.';
      suggestedFix = 'Double check the 8 corners on your cube, or click "Auto-Fix & Solve" below.';
      canAutoFix = true;
    } else if (error instanceof EdgeFlipError) {
      errorTitle = 'Edge Flip Detected';
      errorMessage =
        'A single edge piece is flipped in place. A real Rubik\'s Cube cannot have only one flipped edge.';
      suggestedFix = 'Inspect the 12 edge pieces (pieces with 2 colors), or click "Auto-Fix & Solve" below.';
      canAutoFix = true;
    } else if (error instanceof ParityError) {
      errorTitle = 'Permutation Parity Error';
      errorMessage =
        'Two pieces have traded places (parity error). A legal Rubik\'s Cube configuration requires an even number of piece swaps.';
      suggestedFix = 'Check if two pieces were swapped during sticker entry, or click "Auto-Fix & Solve" below.';
      canAutoFix = true;
    } else if (error instanceof DuplicatePieceError) {
      errorTitle = 'Duplicate Piece Detected';
      errorMessage =
        'The same physical piece appears in two different locations on the cube.';
      suggestedFix = 'Click "Auto-Fix & Solve" to resolve the swap, or inspect duplicate color combinations.';
      canAutoFix = true;
    } else if (error instanceof UnknownPieceError) {
      errorTitle = 'Impossible Piece Detected';
      errorMessage =
        'A corner or edge shows colors that cannot physically exist on a single piece (e.g. opposite colors like White and Yellow on the same piece).';
      suggestedFix = 'Click "Auto-Fix & Solve" to correct the piece, or verify face orientations.';
      canAutoFix = true;
    } else if (error instanceof StickerCountError) {
      errorTitle = 'Incorrect Sticker Counts';
      errorMessage = error.message;
    }

    return {
      isValid: false,
      isComplete: true,
      emptyCount: 0,
      colorCounts,
      errorTitle,
      errorMessage,
      suggestedFix,
      canAutoFix,
    };
  }
}
