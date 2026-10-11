<script lang="ts">
  interface Props {
    label: string
    value: number
    tone?: 'x' | 'o' | 'neutral'
  }

  let { label, value, tone = 'neutral' }: Props = $props()
</script>

<div class="card {tone}">
  <span class="label">{label}</span>
  <span class="value" data-testid="score-value">{value}</span>
</div>

<style>
  .card {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 0;
    padding: 14px 12px;
    border-radius: 14px;
    background: var(--color-surface);
    white-space: nowrap;
  }

  .label {
    color: var(--color-muted);
    font-size: 13px;
    font-weight: 600;
  }

  .value {
    color: var(--color-muted);
    font-size: 28px;
    font-weight: 700;
  }

  .x .value {
    color: var(--color-x);
  }

  .o .value {
    color: var(--color-o);
  }
</style>
