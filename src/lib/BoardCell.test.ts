import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BoardCell from './BoardCell.svelte'

describe('BoardCell', () => {
  it('renders an empty, clickable cell with a position label', async () => {
    const onselect = vi.fn()
    render(BoardCell, { mark: null, index: 5, onselect })

    const cell = screen.getByRole('button', { name: 'Row 2, column 3: empty' })
    expect(cell).toBeEnabled()
    expect(cell).toHaveTextContent('')

    await userEvent.click(cell)
    expect(onselect).toHaveBeenCalledWith(5)
  })

  it.each([
    ['X', 'x'],
    ['O', 'o'],
  ] as const)('shows mark %s and becomes disabled', (mark, cls) => {
    render(BoardCell, { mark, index: 0, onselect: vi.fn() })

    const cell = screen.getByRole('button', { name: `Row 1, column 1: ${mark}` })
    expect(cell).toHaveTextContent(mark)
    expect(cell).toHaveClass(cls)
    expect(cell).toBeDisabled()
  })

  it('can be disabled while empty', () => {
    render(BoardCell, { mark: null, index: 0, disabled: true, onselect: vi.fn() })
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('highlights a winning cell', () => {
    render(BoardCell, { mark: 'X', index: 0, winning: true, onselect: vi.fn() })
    expect(screen.getByRole('button')).toHaveClass('winning')
  })
})
