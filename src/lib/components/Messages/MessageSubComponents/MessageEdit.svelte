<script lang="ts">
  import Button from '$lib/components/Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let text: string;
  const dispatch = createEventDispatcher();
</script>

<form
  on:submit|preventDefault={() => dispatch('handleEditSubmission')}
  class="join w-full"
  action=""
>
  <input type="text" class="input w-full join-item" name="edit" bind:value={text} />
  <Button id="send-message" joinItem>
    <iconify-icon icon="mdi:send" />
  </Button>
</form>
