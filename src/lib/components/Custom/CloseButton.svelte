<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="flex justify-end">
  <button on:click={() => dispatch('close')} class="btn btn-circle btn-sm">
    <iconify-icon icon="mdi:close" />
  </button>
</div>
