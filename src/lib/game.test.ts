import { describe, expect, it } from 'vitest'
import {
  BOARD_SIZE,
  WINNING_LINES,
  currentTurn,
  emptyBoard,
  emptyScore,
  outcome,
  play,
  recordResult,
  type Board,
  type Cell,
} from './game'

/** Builds a board from a 9-character string such as "XO.X.O..." ('.' = empty). */
function board(layout: string): Board {
  return [...layout].map((ch): Cell => (ch === '.' ? null : (ch as Cell)))
}

function playAll(moves: number[]): Board {
  return moves.reduce<Board>((b, i) => play(b, i), emptyBoard())
}

describe('emptyBoard', () => {
  it('has nine empty cells', () => {
    expect(emptyBoard()).toEqual(Array(BOARD_SIZE).fill(null))
  })

  it('returns a fresh array each time', () => {
    expect(emptyBoard()).not.toBe(emptyBoard())
  })
})

describe('currentTurn', () => {
  it('starts with X', () => {
    expect(currentTurn(emptyBoard())).toBe('X')
  })

  it('alternates between X and O', () => {
    expect(currentTurn(board('X........'))).toBe('O')
    expect(currentTurn(board('XO.......'))).toBe('X')
  })
})

describe('outcome', () => {
  it('is in progress on an empty board', () => {
    expect(outcome(emptyBoard())).toEqual({ kind: 'playing', turn: 'X' })
  })

  it.each(WINNING_LINES.map((line) => [line]))('detects a win on line %j', (line) => {
    const cells = emptyBoard()
    for (const i of line) cells[i] = 'O'
    expect(outcome(cells)).toEqual({ kind: 'win', winner: 'O', line })
  })

  it('does not count a mixed line as a win', () => {
    expect(outcome(board('XXO......')).kind).toBe('playing')
  })

  it('detects a draw on a full board with no line', () => {
    expect(outcome(board('XOXXOOOXX'))).toEqual({ kind: 'draw' })
  })

  it('prefers a win over a draw when the last move fills the board', () => {
    expect(outcome(board('XOXOXOOXX'))).toMatchObject({ kind: 'win', winner: 'X', line: [0, 4, 8] })
  })
})

describe('play', () => {
  it('places the current player mark without mutating the input', () => {
    const start = emptyBoard()
    const next = play(start, 4)
    expect(next[4]).toBe('X')
    expect(start[4]).toBeNull()
    expect(play(next, 0)[0]).toBe('O')
  })

  it('ignores a move on an occupied cell', () => {
    const b = board('X........')
    expect(play(b, 0)).toBe(b)
  })

  it.each([-1, 9, 1.5, Number.NaN])('ignores out-of-range index %s', (index) => {
    const b = emptyBoard()
    expect(play(b, index)).toBe(b)
  })

  it('ignores moves once the game is won', () => {
    const won = playAll([0, 3, 1, 4, 2])
    expect(outcome(won)).toMatchObject({ kind: 'win', winner: 'X' })
    expect(play(won, 8)).toBe(won)
  })

  it('plays a full game to a draw', () => {
    expect(outcome(playAll([0, 1, 2, 4, 3, 5, 7, 6, 8]))).toEqual({ kind: 'draw' })
  })
})

describe('recordResult', () => {
  it('credits the winner', () => {
    const score = recordResult(emptyScore(), { kind: 'win', winner: 'O', line: [0, 1, 2] })
    expect(score).toEqual({ X: 0, O: 1, draws: 0 })
  })

  it('counts draws', () => {
    expect(recordResult({ X: 2, O: 1, draws: 0 }, { kind: 'draw' })).toEqual({ X: 2, O: 1, draws: 1 })
  })

  it('leaves the score unchanged while playing', () => {
    const score = emptyScore()
    expect(recordResult(score, { kind: 'playing', turn: 'X' })).toBe(score)
  })
})
