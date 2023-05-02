<script lang="ts">
  import { scale } from 'svelte/transition';

  export let modalType: 'base' | 'error' | 'warning' = 'base';
  let show = false;
  show = true;
</script>

<div>
  <dialog class="modal w-screen h-screen modal-open">
    {#if show}
      <div
        transition:scale
        class="modal-box min-w-max overflow-x-hidden bg-{modalType} dark:bg-{modalType}-content"
      >
        <slot />
      </div>
    {/if}
  </dialog>
</div>
