<script lang="ts">
  import type { Cell } from './game'

  interface Props {
    mark: Cell
    index: number
    disabled?: boolean
    winning?: boolean
    onselect: (index: number) => void
  }

  let { mark, index, disabled = false, winning = false, onselect }: Props = $props()

  const row = $derived(Math.floor(index / 3) + 1)
  const col = $derived((index % 3) + 1)
  const label = $derived(`Row ${row}, column ${col}: ${mark ?? 'empty'}`)
</script>

<button
  type="button"
  class="cell"
  class:x={mark === 'X'}
  class:o={mark === 'O'}
  class:winning
  aria-label={label}
  disabled={disabled || mark !== null}
  onclick={() => onselect(index)}
>
  {#if mark}<span aria-hidden="true">{mark}</span>{/if}
</button>

<style>
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--cell-size);
    height: var(--cell-size);
    padding: 0;
    border: 3px solid transparent;
    border-radius: var(--cell-radius);
    background: var(--color-surface);
    color: var(--color-x);
    font-size: var(--mark-size);
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }

  .cell:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-surface), white 6%);
  }

  .cell:focus-visible {
    outline: 3px solid var(--color-o);
    outline-offset: 3px;
  }

  .cell:disabled {
    cursor: default;
  }

  .o {
    color: var(--color-o);
  }

  .winning {
    border-color: currentColor;
  }
</style>
