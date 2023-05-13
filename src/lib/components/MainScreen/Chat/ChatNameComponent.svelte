<script lang="ts">
  import SearchComponent from '$lib/components/Custom/SearchComponent.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import ChatDropdown from './ChatDropdown.svelte';
  export let searchResults: { messages: MessageResponse[]; messageCount: number } = {
    messages: [],
    messageCount: 0,
  };
  export let activeSearchPage = 1;
  $: userNamesJoined = $chat.users.map((u) => u.userName).join(', ');
  $: search = '';
</script>

<div class="bg-base-200 fixed max-md:w-full lg:w-[75vw] z-30 overflow-hidden py-5">
  <div class="grid grid-cols-2 items-center justify-evenly">
    <div class="font-semibold text-lg">
      {#if $chat.chatName}
        <h1>{$chat.chatName}</h1>
      {:else}
        <h1>{userNamesJoined}</h1>
      {/if}
    </div>
    <div class="flex items-center place-self-end z-50">
      <ChatDropdown />
      <SearchComponent
        bind:search
        bind:results={searchResults}
        bind:activeSearchPage
        invokeCommand="SearchChat"
        receiveCommand="chatSearchResults"
      />
    </div>
  </div>
</div>
