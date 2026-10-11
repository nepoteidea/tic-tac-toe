import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import ScoreCard from './ScoreCard.svelte'

describe('ScoreCard', () => {
  it('renders its label and value', () => {
    render(ScoreCard, { label: 'Draws', value: 4 })
    expect(screen.getByText('Draws')).toBeInTheDocument()
    expect(screen.getByTestId('score-value')).toHaveTextContent('4')
  })

  it.each(['x', 'o', 'neutral'] as const)('applies the %s tone', (tone) => {
    const { container } = render(ScoreCard, { label: 'Player', value: 0, tone })
    expect(container.querySelector('.card')).toHaveClass(tone)
  })

  it('defaults to the neutral tone', () => {
    const { container } = render(ScoreCard, { label: 'Draws', value: 0 })
    expect(container.querySelector('.card')).toHaveClass('neutral')
  })
})
