<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  export let id: string;

  const dispatch = createEventDispatcher();
</script>

<div class="flex justify-end">
  <Button {id} buttonType="button" on:click={() => dispatch('close')} size="small" format="circle">
    <iconify-icon icon="mdi:close" />
  </Button>
</div>
