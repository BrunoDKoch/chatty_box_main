<script lang="ts">
  import { onMount } from 'svelte';
  import { scale } from 'svelte/transition';
  export let token: string;
  let show = false;
  onMount(() => {
    show = true;
  });
</script>

<dialog class="modal w-screen h-screen modal-open">
  {#if show}
    <div transition:scale class="modal-box bg-error dark:bg-error-content">
      {@html token}
    </div>
  {/if}
</dialog>
