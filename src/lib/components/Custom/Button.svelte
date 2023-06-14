<script lang="ts">
  import type { UiType } from '$lib/types/daisyUiTypes';
  export let buttonType: 'button' | 'reset' | 'submit' | null | undefined = 'submit';
  export let buttonUIType: UiType = 'neutral';
  export let format: 'block' | 'square' | 'ghost' | 'wide' | 'link' | 'circle' | undefined =
    undefined;
  export let loading: boolean = false;
  export let disabled: boolean = false;
  export let size: 'xs' | 'sm' | 'md' | 'lg' | undefined = undefined;
  export let className = '';

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
  class="btn {getButtonFormat()} {getSize()} btn-block btn-{buttonUIType} {className}"
>
  {#if loading}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:else}
    <slot />
  {/if}
</button>
