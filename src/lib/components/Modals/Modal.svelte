<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  import CloseButton from '../Custom/CloseButton.svelte';

  export let modalType: 'base' | 'error' | 'warning' = 'base';
  export let additionalClasses: string = '';
  let show = false;
  let modalElement: HTMLDialogElement;
  let bgClass = getBgClass();
  function getBgClass() {
    switch (modalType) {
      case 'error':
        return 'bg-error text-error-content dark:bg-error-content dark:text-error';
      case 'warning':
        return 'bg-warning text-warning-content dark:bg-warning-content dark:text-warning';
      default:
        return 'bg-base';
    }
  }
  onMount(() => {
    modalElement.showModal();
    show = true;
  });
</script>

<div>
  <dialog on:close bind:this={modalElement} class="modal w-screen h-screen">
    {#if show}
      <div transition:scale class="modal-box overflow-x-hidden w-full {bgClass} {additionalClasses}">
        <CloseButton id="modal-close" on:close />
        <slot />
      </div>
    {/if}
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</div>
