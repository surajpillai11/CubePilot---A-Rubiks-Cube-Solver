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

export function countStickers(cube: CubeFaceGrid): Record<CubeColor, number> {
  const counts: Record<CubeColor, number> = {
    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    green: 0,
    blue: 0,
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

  // 1. Verify Center Stickers are 6 unique colors
  const centers: Record<FaceKey, CubeColor> = {
    U: cube.U[4],
    D: cube.D[4],
    L: cube.L[4],
    R: cube.R[4],
    F: cube.F[4],
    B: cube.B[4],
  };

  const uniqueCenterColors = new Set(Object.values(centers));
  if (uniqueCenterColors.size < 6) {
    return {
      isValid: false,
      colorCounts,
      errorTitle: 'Duplicate Center Colors',
      errorMessage:
        'The center stickers (middle piece of each 3x3 face) define the face colors and must all be 6 distinct colors. Please reset or correct duplicate centers.',
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

  // 2. Verify Sticker Counts (exactly 9 of each color)
  const countErrors: string[] = [];
  for (const [color, count] of Object.entries(colorCounts)) {
    if (count !== 9) {
      const diff = count - 9;
      const capColor = color.charAt(0).toUpperCase() + color.slice(1);
      countErrors.push(`${capColor} appears ${count} times (${diff > 0 ? `+${diff}` : `${diff}`})`);
    }
  }

  if (countErrors.length > 0) {
    return {
      isValid: false,
      colorCounts,
      errorTitle: 'Incorrect Sticker Counts',
      errorMessage: `Every color must appear exactly 9 times on the cube. Currently:\n• ${countErrors.join('\n• ')}`,
      suggestedFix: 'Check each face and re-paint the stickers that differ from your real cube.',
    };
  }

  // 3. Structural Validity using Kociemba mathematical checks
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

    // This will throw if cube has impossible corner twist, edge flip, parity error, etc.
    cubeFromFaces(solverGrid);

    return {
      isValid: true,
      colorCounts,
    };
  } catch (error: any) {
    let errorTitle = 'Invalid Cube Configuration';
    let errorMessage = error.message || 'The entered configuration is physically impossible to solve.';
    let suggestedFix = 'Check your physical cube to ensure stickers are placed accurately.';

    if (error instanceof CornerTwistError) {
      errorTitle = 'Corner Twist Detected';
      errorMessage =
        'One corner is twisted in place. On a physical Rubik\'s Cube, this only happens if a corner piece was physically rotated by hand.';
      suggestedFix = 'Double check the 8 corners on your cube. One corner needs its stickers adjusted.';
    } else if (error instanceof EdgeFlipError) {
      errorTitle = 'Edge Flip Detected';
      errorMessage =
        'A single edge piece is flipped in place. A real Rubik\'s Cube cannot have only one flipped edge.';
      suggestedFix = 'Inspect the 12 edge pieces (pieces with 2 colors) and verify both sticker sides.';
    } else if (error instanceof ParityError) {
      errorTitle = 'Permutation Parity Error';
      errorMessage =
        'Two pieces have traded places (parity error). A legal Rubik\'s Cube configuration requires an even number of swaps.';
      suggestedFix = 'Check if two edge or corner pieces were swapped during sticker entry.';
    } else if (error instanceof DuplicatePieceError) {
      errorTitle = 'Duplicate Piece Detected';
      errorMessage =
        'The same physical piece appears in two different locations on the cube.';
      suggestedFix = 'Check for duplicate color pairs on edges or triplets on corners.';
    } else if (error instanceof UnknownPieceError) {
      errorTitle = 'Impossible Piece Detected';
      errorMessage =
        'A corner or edge shows colors that cannot physically exist on a single piece (e.g., opposite colors like White and Yellow on the same piece).';
      suggestedFix = 'Look for adjacent stickers that share opposite colors (White/Yellow, Green/Blue, Red/Orange).';
    } else if (error instanceof StickerCountError) {
      errorTitle = 'Sticker Count Mismatch';
      errorMessage = error.message;
    }

    return {
      isValid: false,
      colorCounts,
      errorTitle,
      errorMessage,
      suggestedFix,
    };
  }
}
