<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher, onMount } from 'svelte';
  export let replyToId: string;
  export let isFromCaller: boolean;
  const dispatch = createEventDispatcher();
  let message: MessageResponse;
  connection.on('specificMessage', (data: MessageResponse) => {
    if (data.id !== replyToId) return;
    message = data;
  });
  onMount(async () => {
    await connection.invoke('GetSpecificMessage', replyToId);
  });
</script>

{#if message}
  <a
    href="/"
    on:click|preventDefault|stopPropagation={() => dispatch('scrollTo', replyToId)}
    class="label opacity-70 {isFromCaller ? 'border-r-2 justify-end' : 'border-l-2'}"
  >
    <span class="label-text">
      {message.user.userName}: {message.text.length > 150
        ? message.text.slice(0, 140) + '...'
        : message.text}
    </span>
  </a>
{/if}
