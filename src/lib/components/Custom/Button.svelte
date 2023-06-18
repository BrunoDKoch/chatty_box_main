<script lang="ts">
  import type { ButtonFormat, UiSize, UiType, ButtonType } from '$lib/types/daisyUiTypes';
  export let buttonType: ButtonType = 'submit';
  export let buttonUIType: UiType = 'neutral';
  export let format: ButtonFormat = undefined;
  export let loading: boolean = false;
  export let disabled: boolean = false;
  export let size: UiSize = undefined;
  export let className = '';
  export let tooltip: string | null = null;
  export let joinItem: boolean = false;

  $: buttonSize = getSize();
  $: buttonFormat = getButtonFormat();

  function getButtonFormat() {
    if (!format) return;
    return `btn-${format}`;
  }
  function getSize() {
    if (!size) return;
    return `btn-${size}`;
  }
</script>

<button
  on:click
  type={buttonType}
  disabled={disabled || loading}
  data-tip={tooltip}
  class="btn {buttonFormat} {joinItem ? 'join-item' : ''} {tooltip
    ? 'tooltip'
    : ''} {buttonSize} btn-{buttonUIType} {className}"
>
  {#if loading}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:else}
    <slot />
  {/if}
</button>
