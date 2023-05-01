<script lang="ts">
  import { scale } from 'svelte/transition';

  export let isErrorModal = false;
  let show = false;
  show = true;
</script>

<div>
  <dialog class="modal w-screen h-screen modal-open">
    {#if show}
      <div
        transition:scale
        class="modal-box min-w-max overflow-x-hidden {isErrorModal
          ? 'bg-error dark:bg-error-content'
          : ''}"
      >
        <slot />
      </div>
    {/if}
  </dialog>
</div>
