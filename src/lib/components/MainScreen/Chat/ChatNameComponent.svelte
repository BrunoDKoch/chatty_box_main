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

<div class="bg-base-200 px-2 max-md:w-full lg:w-[75vw] z-50 py-5">
  <div class="grid max-md:grid-cols-1 lg:grid-cols-2 items-center justify-evenly">
    <div class="font-semibold text-lg">
      <h1 class="max-md:hidden">{$chat.chatName ?? userNamesJoined}</h1>
    </div>
    <div class="flex items-center max-md:w-[100vw] lg:place-self-end z-50">
      <ChatDropdown
        on:openConfirmLeaveModal
        on:openNotificationsModal
        on:openUserRemovalModal
        on:openUserSearchModal
        on:openAddAdminModal
      />
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
