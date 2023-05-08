<script lang="ts">
  import type { CompleteChat, MessageResponse } from '$lib/types/combinationTypes';
  import { chat, chatId } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import MessageComponent from './MessageComponent.svelte';
  import AutoScroller from './AutoScroller.svelte';
  import { date, t } from 'svelte-i18n';
  import ChatNameComponent from './ChatNameComponent.svelte';
  import ChatSubmitter from './ChatSubmitter.svelte';

  let loading = true;
  let searchResults: MessageResponse[] = [];
  $: $chatId, (loading = $chat.id !== $chatId);

  function isFromPreviousDate(message1: MessageResponse, message2: MessageResponse) {
    return new Date(`${message1.sentAt}z`).getDate() !== new Date(`${message2.sentAt}z`).getDate();
  }
  console.log($chat);
</script>

{#if loading}
  <div class="w-full h-full flex items-center justify-center text-8xl">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{/if}

<div class="grid {searchResults.length ? 'grid-cols-3' : 'grid-cols-1'}">
  <div class="flex {searchResults.length ? 'col-span-2' : 'col-span-1'} flex-col max-md:h-[95vh]">
    {#if $chat && $chat.id === $chatId}
      <ChatNameComponent bind:searchResults />
      <div class="overflow-y-auto overflow-x-hidden max-h-[88vh]">
        {#if $chat.hasMore}
          <AutoScroller skip={$chat.messages.length} />
        {/if}
        {#if $chat.messages.length}
          {#each $chat.messages as message}
            {#if $chat.messages.indexOf(message) !== 0 && isFromPreviousDate(message, $chat.messages[$chat.messages.indexOf(message) - 1])}
              <div class="divider">
                <p class="first-letter:uppercase">
                  {$date(new Date(`${message.sentAt}z`), { format: 'full' })}
                </p>
              </div>
            {/if}
            <MessageComponent
              bind:message
              focusOn={$chat.messages.indexOf(message) === $chat.messages.length - 1 &&
                $chat.messages.length <= 15}
            />
          {/each}
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {:else}
          <p>{$t('common.message', { values: { count: 0 } })}</p>
        {/if}
      </div>
      <ChatSubmitter bind:loading />
    {:else}
      <div class="text-9xl flex w-full h-full items-center justify-center">
        <iconify-icon icon="svg-spinners:6-dots-scale" />
      </div>
    {/if}
  </div>
  {#if searchResults.length}
    <div>
      {#each searchResults as result}
        <MessageComponent message={result} focusOn={false} />
      {/each}
    </div>
  {/if}
</div>
