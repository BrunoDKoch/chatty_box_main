<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="flex justify-end">
  <Button on:click={() => dispatch('close')} size="small" format="circle">
    <iconify-icon icon="mdi:close" />
  </Button>
</div>
