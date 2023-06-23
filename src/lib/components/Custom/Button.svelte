<script lang="ts">
  import type { ButtonFormat, UiSize, UiType, ButtonType } from '$lib/types/daisyUiTypes';
  import { onMount } from 'svelte';
  export let buttonType: ButtonType = 'submit';
  export let buttonUIType: UiType = 'neutral';
  export let format: ButtonFormat = 'regular';
  export let loading: boolean = false;
  export let disabled: boolean = false;
  export let size: UiSize = 'base';
  export let additionalClasses = '';
  export let tooltip: string | null = null;
  export let joinItem: boolean = false;
  export let link = '';
  export let id = crypto.randomUUID() as string;

  let className = 'btn';

  function getClassName() {
    let className = 'btn';
    const sizeClasses = {
      base: '',
      small: ' btn-sm',
      'extra-small': ' btn-xs',
      large: ' btn-lg',
    };
    const btnFormat = {
      block: ' btn-block',
      square: ' btn-square',
      ghost: ' btn-ghost',
      wide: ' btn-wide',
      link: ' btn-link',
      circle: ' btn-circle',
      outline: ' btn-outline',
      regular: '',
    };
    const btnBackground = {
      neutral: ' btn-neutral',
      warning: ' btn-warning',
      error: ' btn-error',
      info: ' btn-info',
      success: ' btn-success',
    };
    className += btnBackground[buttonUIType];
    className += btnFormat[format];
    className += sizeClasses[size];
    if (tooltip) className += ' tooltip';
    if (joinItem) className += ' join-item';
    if (additionalClasses) className += ` ${additionalClasses}`;
    return className;
  }
  onMount(() => (className = getClassName()));
</script>

{#if !link}
  <button
    on:click
    {id}
    type={buttonType}
    disabled={disabled || loading}
    data-tip={tooltip}
    class={className}
  >
    {#if loading}
      <iconify-icon icon="svg-spinners:6-dots-scale" />
    {:else}
      <slot />
    {/if}
  </button>
{:else}
  <a href={link} on:click type={buttonType} data-tip={tooltip} class={className}>
    {#if loading}
      <iconify-icon icon="svg-spinners:6-dots-scale" />
    {:else}
      <slot />
    {/if}
  </a>
{/if}
