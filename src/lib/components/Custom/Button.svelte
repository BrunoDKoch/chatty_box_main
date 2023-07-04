<script lang="ts">
  import type { ButtonFormat, UiSize, UiType, ButtonType } from '$lib/types/daisyUiTypes';
  import { btnBackground, btnFormat, sizeClasses } from '$lib/types/daisyUiTypes';
  import { createEventDispatcher } from 'svelte';
  export let buttonType: ButtonType = 'submit';
  export let buttonUIType: UiType = 'neutral';
  export let format: ButtonFormat = 'regular';
  export let loading = false;
  export let disabled = false;
  export let size: UiSize = 'base';
  export let additionalClasses = '';
  export let tooltip: string | null = null;
  export let joinItem = false;
  export let link = '';
  export let id: string;
  export let target: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  function getClassName(button: HTMLButtonElement | HTMLAnchorElement) {
    button.classList.add('btn', btnBackground[buttonUIType], sizeClasses[size]);
    if (joinItem) button.classList.add('join-item');
    if (btnFormat[format]) button.classList.add(btnFormat[format]);
    if (tooltip) button.classList.add('tooltip');
    if (additionalClasses) button.classList.add(...additionalClasses.split(' '));
  }
</script>

{#if !link}
  <button
    on:click
    on:contextmenu
    {id}
    type={buttonType}
    disabled={disabled || loading}
    data-tip={tooltip}
    use:getClassName
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
    on:contextmenu
    {target}
    type={buttonType}
    data-tip={tooltip}
    use:getClassName
  >
    {#if loading}
      <iconify-icon icon="svg-spinners:6-dots-scale" />
    {:else}
      <slot />
    {/if}
  </a>
{/if}
