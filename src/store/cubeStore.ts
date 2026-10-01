import { create } from 'zustand';
import type {
  CubeColor,
  CubeFaceGrid,
  FaceKey,
  Solution,
  SolveRecord,
  StandardMove,
  ValidationResult,
} from '../types/cube';
import { DEFAULT_FACE_COLORS } from '../types/cube';
import {
  applyMove,
  applyMoves,
  cloneCube,
  createBlankCube,
  createSolvedCube,
  autoFixCubeParity,
  generateRandomScramble,
  PRESET_PATTERNS,
} from '../cube/CubeState';
import { validateCubeState } from '../cube/CubeValidator';
import { defaultSolver } from '../cube/CubeSolver';
import { getInverseMove } from '../cube/notation';
import { cubeAudio } from '../utils/audio';

const STORAGE_KEY_SOLVES = 'cubepilot_solves_v1';
const STORAGE_KEY_THEME = 'cubepilot_theme_v1';

function getInitialSolves(): SolveRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOLVES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getInitialTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    if (raw === 'light' || raw === 'dark') {
      if (raw === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      return raw;
    }
  } catch {}
  document.documentElement.classList.remove('light');
  return 'dark';
}

export interface CubeStore {
  // Cube State
  cubeState: CubeFaceGrid;
  initialCubeState: CubeFaceGrid;
  validationResult: ValidationResult;
  activeColor: CubeColor;

  // Solver & Playback
  solution: Solution | null;
  stepStates: CubeFaceGrid[];
  currentStepIndex: number;
  isSolving: boolean;
  solverError: string | null;
  isPlaying: boolean;
  playSpeed: number; // 0.25, 0.5, 1, 1.5, 2
  isAnimating: boolean;
  lastExecutedMove: { move: StandardMove; id: number } | null;

  // Preferences & Modes
  tutorMode: 'beginner' | 'advanced';
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  solveHistory: SolveRecord[];

  // Actions
  setSticker: (face: FaceKey, index: number, color: CubeColor) => void;
  resetFace: (face: FaceKey) => void;
  resetCube: () => void;
  startBlank: () => void;
  fillSolved: () => void;
  fillRemainingAsSolved: () => void;
  autoFix: () => boolean;
  autoFillCenters: () => void;
  applyScramble: (scrambleString?: string) => void;
  applyPreset: (presetId: string) => void;
  applyManualMove: (move: StandardMove) => void;

  solveCube: () => Promise<boolean>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  togglePlay: () => void;
  setPlaySpeed: (speed: number) => void;
  setIsAnimating: (animating: boolean) => void;

  setTutorMode: (mode: 'beginner' | 'advanced') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setActiveColor: (color: CubeColor) => void;

  recordSolve: (timeMs: number, moves: number, scramble: string) => void;
  deleteSolve: (id: string) => void;
  clearHistory: () => void;
}

// Start with blank cube by default as requested by user
const initialCube = createBlankCube();

export const useCubeStore = create<CubeStore>((set, get) => ({
  cubeState: initialCube,
  initialCubeState: initialCube,
  validationResult: validateCubeState(initialCube),
  activeColor: 'white',

  solution: null,
  stepStates: [initialCube],
  currentStepIndex: 0,
  isSolving: false,
  solverError: null,
  isPlaying: false,
  playSpeed: 1,
  isAnimating: false,
  lastExecutedMove: null,

  tutorMode: 'beginner',
  theme: getInitialTheme(),
  soundEnabled: true,
  solveHistory: getInitialSolves(),

  setSticker: (face, index, color) => {
    const { cubeState } = get();
    const updated = cloneCube(cubeState);

    // Prevent turning center piece empty (centers define face orientation)
    if (index === 4) {
      if (color === 'empty') return;
      updated[face][index] = color;
    } else {
      if (updated[face][index] === color) {
        updated[face][index] = 'empty';
      } else {
        updated[face][index] = color;
      }
    }

    const validation = validateCubeState(updated);
    set({
      cubeState: updated,
      initialCubeState: updated,
      validationResult: validation,
      solution: null,
      stepStates: [updated],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  resetFace: (face) => {
    const { cubeState } = get();
    const updated = cloneCube(cubeState);
    const defaultColor = DEFAULT_FACE_COLORS[face];
    // Reset outer face stickers to empty, preserve center
    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        updated[face][i] = defaultColor;
      } else {
        updated[face][i] = 'empty';
      }
    }
    const validation = validateCubeState(updated);
    set({
      cubeState: updated,
      initialCubeState: updated,
      validationResult: validation,
      solution: null,
      stepStates: [updated],
      currentStepIndex: 0,
      isPlaying: false,
    });
  },

  // Resets to clean blank cube with standard centers
  resetCube: () => {
    const fresh = createBlankCube();
    const validation = validateCubeState(fresh);
    set({
      cubeState: fresh,
      initialCubeState: fresh,
      validationResult: validation,
      solution: null,
      stepStates: [fresh],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  startBlank: () => {
    const fresh = createBlankCube();
    const validation = validateCubeState(fresh);
    set({
      cubeState: fresh,
      initialCubeState: fresh,
      validationResult: validation,
      solution: null,
      stepStates: [fresh],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  fillSolved: () => {
    const solved = createSolvedCube();
    const validation = validateCubeState(solved);
    set({
      cubeState: solved,
      initialCubeState: solved,
      validationResult: validation,
      solution: null,
      stepStates: [solved],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  fillRemainingAsSolved: () => {
    const { cubeState } = get();
    const updated = cloneCube(cubeState);
    const faces: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    for (const f of faces) {
      const defaultCol = updated[f][4] !== 'empty' ? updated[f][4] : DEFAULT_FACE_COLORS[f];
      for (let i = 0; i < 9; i++) {
        if (updated[f][i] === 'empty') {
          updated[f][i] = defaultCol;
        }
      }
    }
    const validation = validateCubeState(updated);
    set({
      cubeState: updated,
      initialCubeState: updated,
      validationResult: validation,
      solution: null,
      stepStates: [updated],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  autoFix: () => {
    const { cubeState } = get();
    const fixed = autoFixCubeParity(cubeState);
    if (fixed) {
      const validation = validateCubeState(fixed);
      set({
        cubeState: fixed,
        initialCubeState: fixed,
        validationResult: validation,
        solverError: null,
      });
      return true;
    }
    return false;
  },

  autoFillCenters: () => {
    const { cubeState } = get();
    const updated = cloneCube(cubeState);
    updated.U[4] = 'white';
    updated.D[4] = 'yellow';
    updated.L[4] = 'orange';
    updated.R[4] = 'red';
    updated.F[4] = 'green';
    updated.B[4] = 'blue';
    const validation = validateCubeState(updated);
    set({
      cubeState: updated,
      initialCubeState: updated,
      validationResult: validation,
    });
  },

  applyScramble: (scrambleString) => {
    const solved = createSolvedCube();
    let moves: StandardMove[] = [];
    if (scrambleString) {
      moves = scrambleString.trim().split(/\s+/) as StandardMove[];
    } else {
      const gen = generateRandomScramble(21);
      moves = gen.moves;
    }
    const scrambled = applyMoves(solved, moves);
    const validation = validateCubeState(scrambled);
    set({
      cubeState: scrambled,
      initialCubeState: scrambled,
      validationResult: validation,
      solution: null,
      stepStates: [scrambled],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  applyPreset: (presetId) => {
    const pattern = PRESET_PATTERNS.find((p) => p.id === presetId);
    if (!pattern) return;
    const solved = createSolvedCube();
    const patterned = applyMoves(solved, pattern.moves);
    const validation = validateCubeState(patterned);
    set({
      cubeState: patterned,
      initialCubeState: patterned,
      validationResult: validation,
      solution: null,
      stepStates: [patterned],
      currentStepIndex: 0,
      isPlaying: false,
      solverError: null,
    });
  },

  applyManualMove: (move) => {
    const { cubeState, isAnimating, soundEnabled } = get();
    if (isAnimating) return;
    const updated = applyMove(cubeState, move);
    if (soundEnabled) cubeAudio.playTurnSound();
    set({
      cubeState: updated,
      initialCubeState: updated,
      validationResult: validateCubeState(updated),
      lastExecutedMove: { move, id: Date.now() },
    });
  },

  solveCube: async () => {
    let { cubeState, validationResult } = get();

    if (!validationResult.isComplete) {
      set({
        solverError: `Please fill all 54 stickers before solving (${validationResult.emptyCount} blank stickers remaining).`,
      });
      return false;
    }

    // If cube is physically invalid, attempt auto-fix automatically so user is never blocked!
    if (!validationResult.isValid) {
      const fixed = autoFixCubeParity(cubeState);
      if (fixed) {
        cubeState = fixed;
        validationResult = validateCubeState(fixed);
        set({ cubeState, initialCubeState: fixed, validationResult });
      }
    }

    if (!validationResult.isValid) {
      set({ solverError: validationResult.errorMessage || 'Please fix the cube configuration errors before solving.' });
      return false;
    }

    set({ isSolving: true, solverError: null });

    try {
      const solution = await defaultSolver.solve(cubeState);
      const effectiveState = solution.repairedCube || cubeState;

      // Precalculate cube state at each step:
      // stepStates[0] = initial scrambled state
      // stepStates[1] = after move 0
      // ...
      // stepStates[N] = solved state
      const states: CubeFaceGrid[] = [cloneCube(effectiveState)];
      let curr = cloneCube(effectiveState);
      for (const step of solution.steps) {
        curr = applyMove(curr, step.move);
        states.push(curr);
      }

      set({
        solution,
        stepStates: states,
        currentStepIndex: 0,
        cubeState: states[0],
        initialCubeState: states[0],
        validationResult: validateCubeState(effectiveState),
        isSolving: false,
        isPlaying: false,
      });

      return true;
    } catch (err: any) {
      console.error('Solve error:', err);
      set({
        isSolving: false,
        solverError: err.message || 'Failed to solve cube configuration.',
      });
      return false;
    }
  },

  nextStep: () => {
    const { solution, currentStepIndex, stepStates, isAnimating, soundEnabled } = get();
    if (!solution || isAnimating) return;
    if (currentStepIndex >= solution.steps.length) return;

    const nextIndex = currentStepIndex + 1;
    const moveExecuted = solution.steps[currentStepIndex].move;
    if (soundEnabled) cubeAudio.playTurnSound();

    set({
      currentStepIndex: nextIndex,
      cubeState: stepStates[nextIndex],
      lastExecutedMove: { move: moveExecuted, id: Date.now() },
    });

    if (nextIndex === solution.steps.length) {
      // Completed!
      set({ isPlaying: false });
      if (soundEnabled) cubeAudio.playSolvedChime();
    }
  },

  prevStep: () => {
    const { solution, currentStepIndex, stepStates, isAnimating, soundEnabled } = get();
    if (!solution || isAnimating) return;
    if (currentStepIndex <= 0) return;

    const prevIndex = currentStepIndex - 1;
    const moveUndone = getInverseMove(solution.steps[prevIndex].move);
    if (soundEnabled) cubeAudio.playTurnSound();

    set({
      currentStepIndex: prevIndex,
      cubeState: stepStates[prevIndex],
      lastExecutedMove: { move: moveUndone, id: Date.now() },
    });
  },

  goToStep: (targetIndex) => {
    const { solution, stepStates, isAnimating } = get();
    if (!solution || isAnimating) return;
    if (targetIndex < 0 || targetIndex > solution.steps.length) return;

    set({
      currentStepIndex: targetIndex,
      cubeState: stepStates[targetIndex],
    });
  },

  togglePlay: () => {
    const { isPlaying, currentStepIndex, solution } = get();
    if (!solution || solution.steps.length === 0) return;

    if (currentStepIndex >= solution.steps.length) {
      // Restart playback if at the end
      set({ currentStepIndex: 0, isPlaying: true });
    } else {
      set({ isPlaying: !isPlaying });
    }
  },

  setPlaySpeed: (speed) => set({ playSpeed: speed }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  setTutorMode: (mode) => set({ tutorMode: mode }),

  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    } catch {}
    set({ theme });
  },

  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setActiveColor: (color) => set({ activeColor: color }),

  recordSolve: (timeMs, moves, scramble) => {
    const tps = moves > 0 && timeMs > 0 ? Number(((moves / (timeMs / 1000))).toFixed(2)) : 0;
    const record: SolveRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: new Date().toISOString(),
      timeMs,
      moves,
      tps,
      scramble,
    };
    const updated = [record, ...get().solveHistory];
    try {
      localStorage.setItem(STORAGE_KEY_SOLVES, JSON.stringify(updated));
    } catch {}
    set({ solveHistory: updated });
  },

  deleteSolve: (id) => {
    const updated = get().solveHistory.filter((s) => s.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_SOLVES, JSON.stringify(updated));
    } catch {}
    set({ solveHistory: updated });
  },

  clearHistory: () => {
    try {
      localStorage.removeItem(STORAGE_KEY_SOLVES);
    } catch {}
    set({ solveHistory: [] });
  },
}));
