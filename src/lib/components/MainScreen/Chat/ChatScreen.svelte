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
  import MessagesWrapper from './MessagesWrapper.svelte';

  let loading = true;
  let searchResults: { messages: MessageResponse[]; messageCount: number } = {
    messages: [],
    messageCount: 0,
  };
  $: $chatId, (loading = $chat.id !== $chatId);
  $: activeSearchPage = 1;

  console.log($chat);
</script>

{#if loading}
  <div class="w-full h-full flex items-center justify-center text-8xl">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{/if}

<div
  class="grid {searchResults.messages && searchResults.messages.length
    ? 'grid-cols-3'
    : 'grid-cols-1'}"
>
  <div
    class="flex {searchResults.messages && searchResults.messages.length
      ? 'col-span-2'
      : 'col-span-1'} flex-col max-md:h-[95vh]"
  >
    {#if $chat && $chat.id === $chatId}
      <ChatNameComponent bind:activeSearchPage bind:searchResults />
      <MessagesWrapper bind:messages={$chat.messages} bind:total={$chat.messageCount} />
      <ChatSubmitter bind:loading />
    {:else}
      <div class="text-9xl flex w-full h-full items-center justify-center">
        <iconify-icon icon="svg-spinners:6-dots-scale" />
      </div>
    {/if}
  </div>
  {#if searchResults.messages && searchResults.messages.length}
    <MessagesWrapper
      bind:messages={searchResults.messages}
      bind:total={searchResults.messageCount}
      bind:activePage={activeSearchPage}
      pagination
    />
  {/if}
</div>
