<script lang="ts">
    import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';

  export let modalType: 'base' | 'error' | 'warning' = 'base';
  let show = false;
  let modalElement: HTMLDialogElement;
  let bgClass = getBgClass();
  function getBgClass() {
    switch (modalType) {
      case 'error':
        return 'bg-error dark:bg-error-content';
      case 'warning':
        return 'bg-warning dark:bg-warning-content';
      default:
        return 'bg-base'
    }
  }
  onMount(() => {
    modalElement.showModal();
    show = true;
  })
</script>

<div>
  <dialog bind:this={modalElement} class="modal w-screen h-screen">
    {#if show}
      <div
        transition:scale
        class="modal-box min-w-max overflow-x-hidden {bgClass}"
      >
        <slot />
      </div>
    {/if}
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</div>
