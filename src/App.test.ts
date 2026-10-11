import { render, screen, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.svelte'

const cell = (i: number) => within(screen.getByRole('group', { name: 'Game board' })).getAllByRole('button')[i]
const status = () => screen.getByRole('status')
const score = (label: string) =>
  within(screen.getByText(label).parentElement!).getByTestId('score-value').textContent

async function playMoves(...moves: number[]) {
  for (const i of moves) await userEvent.click(cell(i))
}

describe('App', () => {
  beforeEach(() => {
    render(App)
  })

  it('renders the header, an empty board and zero scores', () => {
    expect(screen.getByRole('heading', { name: 'Tic-Tac-Toe' })).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Game board' })).getAllByRole('button')).toHaveLength(9)
    expect(status()).toHaveTextContent("Player X's turn")
    expect(score('Player X')).toBe('0')
    expect(score('Draws')).toBe('0')
    expect(score('Player O')).toBe('0')
  })

  it('alternates turns and ignores clicks on taken cells', async () => {
    await playMoves(4)
    expect(cell(4)).toHaveTextContent('X')
    expect(status()).toHaveTextContent("Player O's turn")
    expect(status().querySelector('.dot')).toHaveClass('o')

    await playMoves(4)
    expect(status()).toHaveTextContent("Player O's turn")

    await playMoves(0)
    expect(cell(0)).toHaveTextContent('O')
    expect(status()).toHaveTextContent("Player X's turn")
  })

  it('announces a win, highlights the line, locks the board and scores it', async () => {
    await playMoves(0, 3, 1, 4, 2)

    expect(status()).toHaveTextContent('Player X wins!')
    for (const i of [0, 1, 2]) expect(cell(i)).toHaveClass('winning')
    expect(cell(5)).toBeDisabled()
    expect(score('Player X')).toBe('1')
  })

  it('announces a draw and scores it', async () => {
    await playMoves(0, 1, 2, 4, 3, 5, 7, 6, 8)

    expect(status()).toHaveTextContent("It's a draw")
    expect(status().querySelector('.dot')).toHaveClass('neutral')
    expect(score('Draws')).toBe('1')
  })

  it('starts a new game but keeps the score', async () => {
    await playMoves(3, 0, 4, 1, 8, 2)
    expect(status()).toHaveTextContent('Player O wins!')

    await userEvent.click(screen.getByRole('button', { name: 'New game' }))

    expect(status()).toHaveTextContent("Player X's turn")
    for (let i = 0; i < 9; i++) expect(cell(i)).toHaveTextContent('')
    expect(score('Player O')).toBe('1')
  })

  it('resets the scores', async () => {
    await playMoves(0, 3, 1, 4, 2)
    await userEvent.click(screen.getByRole('button', { name: 'Reset scores' }))
    expect(score('Player X')).toBe('0')
  })
})
