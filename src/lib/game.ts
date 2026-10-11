export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = readonly Cell[]

export type Outcome =
  | { kind: 'playing'; turn: Player }
  | { kind: 'win'; winner: Player; line: readonly number[] }
  | { kind: 'draw' }

export interface Score {
  X: number
  O: number
  draws: number
}

export const BOARD_SIZE = 9

export const WINNING_LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function emptyBoard(): Cell[] {
  return Array<Cell>(BOARD_SIZE).fill(null)
}

export function emptyScore(): Score {
  return { X: 0, O: 0, draws: 0 }
}

/** X always opens, so the side to move follows from how many marks are down. */
export function currentTurn(board: Board): Player {
  const marks = board.filter((cell) => cell !== null).length
  return marks % 2 === 0 ? 'X' : 'O'
}

export function outcome(board: Board): Outcome {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    const mark = board[a]
    if (mark && mark === board[b] && mark === board[c]) {
      return { kind: 'win', winner: mark, line }
    }
  }
  if (board.every((cell) => cell !== null)) return { kind: 'draw' }
  return { kind: 'playing', turn: currentTurn(board) }
}

/** Returns a new board with the current player's mark at `index`, or the same board if the move is illegal. */
export function play(board: Board, index: number): Board {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) return board
  if (board[index] !== null) return board
  if (outcome(board).kind !== 'playing') return board

  const next = board.slice()
  next[index] = currentTurn(board)
  return next
}

export function recordResult(score: Score, result: Outcome): Score {
  if (result.kind === 'win') return { ...score, [result.winner]: score[result.winner] + 1 }
  if (result.kind === 'draw') return { ...score, draws: score.draws + 1 }
  return score
}
