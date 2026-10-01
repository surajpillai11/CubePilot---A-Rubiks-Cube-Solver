# CubePilot — 3D Rubik's Cube Solver & Interactive Tutor

**CubePilot** is a production-quality, responsive web application that lets users manually enter the 54 colors of their Rubik's Cube, validates the cube configuration in real-time with physical parity checking, solves it using the Kociemba Two-Phase Algorithm, and teaches the solution step-by-step with genuine 3D layer turning animations.

---

## ✨ Features

- **Genuine 3D Rubik's Cube**: Built with Three.js, React Three Fiber, and @react-three/drei. Features 26 tactile cubies with rounded bevel styling, outer color stickers, and realistic contact shadows.
- **Physical Layer Rotations**: When a move like `R` or `U'` is triggered, all 9 cubies in that layer physically rotate about their axis with smooth cubic easing and directional rotation arrows (`↻` or `↺`).
- **Interactive 2D Unfolded Net**: Easily input all 54 stickers on standard $U, L, F, R, B, D$ faces with color palette swatches, live sticker count badges, and preset patterns (Checkerboard, Superflip, Cube in a Cube, Anaconda).
- **Real-Time Parity & Validity Diagnostic**: Automatically detects impossible configurations, single twisted corners, single flipped edges, sticker count imbalances, and duplicate centers with actionable advice.
- **Kociemba Two-Phase Solver**: Computes an optimal ~20-move solution client-side in under 5 milliseconds with background prewarming.
- **Personal Interactive Tutor**:
  - Displays human-friendly instructions: *"Turn the RIGHT face counter-clockwise (90°)"*.
  - Highlights the active face with an animated 3D glow frame and directional turning ring.
  - Answers *"What do I do next?"* and provides *"How to hold your cube"* tips.
  - Interactive solution timeline with clickable move pills and auto-scrolling.
  - Playback controls: Previous, Next, Auto-Play, Restart, and Speed multipliers ($0.5\times, 1\times, 1.5\times, 2\times$).
  - Beginner Mode vs. Advanced Mode toggle.
  - Keyboard shortcuts (`Space` = Play/Pause, `←`/`→` = Step, `R` = Restart).
  - Confetti celebration upon solve completion!
- **Speedcubing Timer**:
  - Spacebar hold-to-start (red $\to$ green $\to$ release to start).
  - Touch-and-hold support on mobile.
  - WCA random-state scrambler.
  - Turns-per-second (TPS) counter and solve history with Personal Best, Ao5, and Ao12.
- **Interactive Algorithm Library**:
  - Step-by-step beginner guide to the CFOP method.
  - Interactive 3D algorithm runner for the Sexy Move (`R U R' U'`), Sune (`R U R' U R U2 R'`), T-Perm, and J-Perm.
- **Audio Feedback**:
  - Procedural Web Audio API sound effects for mechanical cube clicks and solve chimes (zero external audio asset dependencies).

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node.js 24)
- npm 9+

### Installation

```bash
# Clone or navigate to the project directory
cd "Rubiks Cube Solver"

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Test Suite

```bash
npm test
```

Executes the 29-test cube engine verification suite checking:
- Move identity cycles: $R \times 4 = I$, $R + R' = I$, $R2 + R2 = I$ across all 6 faces.
- Sticker count validation and duplicate center detection.
- Physical corner twist detection.
- End-to-end Kociemba solves for sexy moves, random scrambles, and preset patterns.

### Building for Production

```bash
npm run build
```

---

## 🏛️ Architecture

```text
src/
├── types/
│   └── cube.ts               # Core types (faces, moves, colors, solutions, history)
├── cube/
│   ├── CubeState.ts          # State model, move application, scrambler, presets
│   ├── CubeValidator.ts      # Real-time parity, twist, flip and count checks
│   ├── CubeSolver.ts         # Kociemba Two-Phase engine & background prewarming
│   ├── notation.ts           # Move explanations, parsing and human coaching tips
│   └── __tests__/            # Comprehensive test suite (29 tests)
├── three/
│   ├── Cubie.tsx             # 3D cubie piece with tactile stickers and plastic core
│   ├── FaceIndicator.tsx     # 3D luminous highlight frame and directional turning ring
│   ├── RubiksCube.tsx        # Physical layer rotation engine and animation loop
│   └── CubeCanvas.tsx        # Studio lighting, OrbitControls and camera controls
├── components/
│   ├── cube/
│   │   ├── ColorPalette.tsx  # Color swatches with live count badges
│   │   └── CubeNet2D.tsx     # 2D unfolded cross layout
│   ├── solver/
│   │   ├── SolutionTimeline.tsx # Horizontal move pills with auto-scroll
│   │   ├── TutorPanel.tsx       # Human guidance, playback controls and shortcuts
│   │   └── ValidationStatus.tsx # Diagnostic alert and solve CTA
│   └── layout/
│       ├── Navbar.tsx        # Logo, navigation, audio/theme toggles, shortcuts modal
│       ├── Footer.tsx        # Responsive footer
│       └── Layout.tsx        # Page wrapper
├── pages/
│   ├── Home.tsx              # Landing page with interactive 3D hero sandbox
│   ├── CubeInput.tsx         # 54-sticker input with live 3D preview
│   ├── Solution.tsx          # 3D Solution Viewer & Tutor
│   ├── Timer.tsx             # Speedcubing competition timer
│   ├── Learn.tsx             # CFOP knowledge base & interactive 3D algorithm runner
│   ├── Statistics.tsx        # PB, Ao5, Ao12, solve history table
│   └── NotFound.tsx          # 404 page
├── store/
│   └── cubeStore.ts          # Zustand state store with step-states and persistence
└── utils/
    └── audio.ts              # Web Audio API procedural sound synthesizer
```

---

## 🎮 Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / Pause solution auto-playback (or Hold on Timer page to arm timer) |
| `→` (Right Arrow) | Step forward to the next solution move |
| `←` (Left Arrow) | Step backward to the previous solution move |
| `R` | Restart solution playback from Step 1 |

---

## 📜 License

MIT License.
