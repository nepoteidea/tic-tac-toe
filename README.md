# Tic-Tac-Toe

Two-player tic-tac-toe for one device, built with Svelte 5 + TypeScript and Vite.
The UI follows the Figma file [Tic-Tac-Toe — Responsive Design](https://www.figma.com/design/1g1kHHkN8c0kGGgMUjI9d0)
(mobile layout below 1024px, two-column desktop layout above). Tracks [NEP-12](https://linear.app/nepoteidea/issue/NEP-12).

## Features

- X always opens; turns alternate automatically
- Win detection (with the winning line highlighted) and draw detection
- Running scoreboard for X, O and draws
- **New game** clears the board; **Reset scores** zeroes the scoreboard
- Keyboard and screen-reader friendly: each cell is a labelled button, and the status line is a live region

## Getting started

```sh
npm install
npm run dev
```

| Script                  | What it does                                   |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the dev server                           |
| `npm run build`         | Production build into `dist/`                  |
| `npm run preview`       | Serve the production build                     |
| `npm run check`         | Type-check Svelte and TypeScript               |
| `npm test`              | Run the test suite once                        |
| `npm run test:watch`    | Run tests in watch mode                        |
| `npm run test:coverage` | Run tests with coverage and enforce thresholds |

## Project layout

```
src/
  lib/game.ts           Pure game rules: moves, turns, win/draw detection, scoring
  lib/BoardCell.svelte  "Board Cell" component from the design
  lib/ScoreCard.svelte  "Score Card" component from the design
  App.svelte            Screen layout and game state
  app.css               Design tokens and global styles
```

## Testing

[Vitest](https://vitest.dev) with jsdom and [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro):

- `game.test.ts`: every winning line, draws, illegal moves, immutability, scoring
- `BoardCell.test.ts` and `ScoreCard.test.ts`: component rendering and states
- `App.test.ts`: full games played through the UI (turns, wins, draws, new game, reset)

Coverage is enforced at 100% for lines, statements and functions. Branches are held at 90%
because the Svelte compiler emits `?? ''` fallbacks for template interpolations that can
never be nullish. CI (`.github/workflows/ci.yml`) runs type-check, tests with coverage, and
the build on every push and pull request.
