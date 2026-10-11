<script lang="ts">
  import BoardCell from './lib/BoardCell.svelte'
  import ScoreCard from './lib/ScoreCard.svelte'
  import { emptyBoard, emptyScore, outcome, play, recordResult, type Board, type Score } from './lib/game'

  let board: Board = $state(emptyBoard())
  let score: Score = $state(emptyScore())

  const result = $derived(outcome(board))
  const gameOver = $derived(result.kind !== 'playing')

  const status = $derived.by(() => {
    if (result.kind === 'win') return { text: `Player ${result.winner} wins!`, tone: result.winner.toLowerCase() }
    if (result.kind === 'draw') return { text: "It's a draw", tone: 'neutral' }
    return { text: `Player ${result.turn}'s turn`, tone: result.turn.toLowerCase() }
  })

  function select(index: number) {
    board = play(board, index)
    score = recordResult(score, outcome(board))
  }

  function newGame() {
    board = emptyBoard()
  }

  function resetScores() {
    score = emptyScore()
  }
</script>

<main class="game">
  <header class="header">
    <h1>Tic-Tac-Toe</h1>
    <p>Two players, one device<span class="wide-only">. First to three in a row wins.</span></p>
  </header>

  <p class="status" role="status" aria-live="polite">
    <span class="dot {status.tone}" aria-hidden="true"></span>
    {status.text}
  </p>

  <div class="board" role="group" aria-label="Game board">
    {#each board as mark, index (index)}
      <BoardCell
        {mark}
        {index}
        disabled={gameOver}
        winning={result.kind === 'win' && result.line.includes(index)}
        onselect={select}
      />
    {/each}
  </div>

  <section class="scoreboard" aria-label="Scoreboard">
    <ScoreCard label="Player X" value={score.X} tone="x" />
    <ScoreCard label="Draws" value={score.draws} />
    <ScoreCard label="Player O" value={score.O} tone="o" />
  </section>

  <div class="actions">
    <button type="button" class="button primary" onclick={newGame}>New game</button>
    <button type="button" class="button secondary" onclick={resetScores}>Reset scores</button>
  </div>
</main>

<style>
  /* Mobile frame ("Mobile — 390") is the base; the desktop frame kicks in at 1024px. */
  .game {
    --cell-size: min(100px, calc((100vw - 48px - 20px) / 3));
    --cell-gap: 10px;
    --cell-radius: 16px;
    --mark-size: calc(var(--cell-size) * 0.56);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-width: 438px;
    margin: 0 auto;
    padding: 56px 24px 32px;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }

  h1 {
    margin: 0;
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text);
  }

  .header p {
    margin: 0;
    font-size: 15px;
    color: var(--color-muted);
  }

  .wide-only {
    display: none;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--color-surface);
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-muted);
  }

  .dot.x {
    background: var(--color-x);
  }

  .dot.o {
    background: var(--color-o);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, var(--cell-size));
    gap: var(--cell-gap);
  }

  .scoreboard {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .button {
    flex: 1 0 0;
    min-width: 0;
    padding: 16px 24px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: filter 120ms ease;
  }

  .button:hover {
    filter: brightness(1.1);
  }

  .button:focus-visible {
    outline: 3px solid var(--color-text);
    outline-offset: 3px;
  }

  .primary {
    border: 0;
    background: var(--color-o);
    color: var(--color-bg);
  }

  .secondary {
    border: 1.5px solid var(--color-border);
    background: transparent;
    color: var(--color-text);
  }

  @media (min-width: 1024px) {
    .game {
      /* 168px cells as designed, shrinking between 1024px and 1180px so the side panel still fits. */
      --cell-size: min(168px, calc((100vw - 400px - 96px - 96px - 32px) / 3));
      --cell-gap: 16px;
      --cell-radius: 24px;

      display: grid;
      grid-template-columns: auto 400px;
      /* The 1fr spacer rows centre the side panel against the taller board. */
      grid-template-rows: 1fr auto auto auto auto 1fr;
      grid-template-areas:
        'board .'
        'board header'
        'board status'
        'board scoreboard'
        'board actions'
        'board .';
      align-content: center;
      align-items: start;
      justify-content: center;
      column-gap: 96px;
      row-gap: 28px;
      max-width: none;
      min-height: 100vh;
      min-height: 100dvh;
      padding: 48px;
    }

    .header {
      grid-area: header;
      align-items: flex-start;
      gap: 8px;
      text-align: left;
    }

    h1 {
      font-size: 48px;
    }

    .header p {
      font-size: 17px;
    }

    .wide-only {
      display: inline;
    }

    .status {
      grid-area: status;
      justify-self: start;
    }

    .board {
      grid-area: board;
      align-self: center;
    }

    .scoreboard {
      grid-area: scoreboard;
    }

    .actions {
      grid-area: actions;
      flex-direction: row;
      gap: 12px;
    }
  }
</style>
