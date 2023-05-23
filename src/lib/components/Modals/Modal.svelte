<script lang="ts">
  import { scale } from 'svelte/transition';

  export let modalType: 'base' | 'error' | 'warning' = 'base';
  let show = false;
  show = true;
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
</script>

<div>
  <dialog class="modal w-screen h-screen modal-open">
    {#if show}
      <div
        transition:scale
        class="modal-box min-w-max overflow-x-hidden {bgClass}"
      >
        <slot />
      </div>
    {/if}
  </dialog>
</div>
