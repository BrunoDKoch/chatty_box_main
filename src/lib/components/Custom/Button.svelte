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
  export let link = '';
  export let id = crypto.randomUUID() as string;

  $: buttonSize = getSize();
  $: buttonFormat = getButtonFormat();
  if (link) console.log({link})

  function getButtonFormat() {
    if (!format) return '';
    return `btn-${format}`;
  }
  function getSize() {
    if (!size) return '';
    return `btn-${size}`;
  }
</script>

{#if !link}
  <button
    on:click
    {id}
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
{:else}
  <a
    href={link}
    on:click
    type={buttonType}
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
  </a>
{/if}
