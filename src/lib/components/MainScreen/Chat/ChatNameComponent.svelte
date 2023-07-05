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
  export let search = '';
  $: userNamesJoined = $chat.users.map((u) => u.userName).join(', ');
</script>

<div class="bg-base-200 box-border px-2 max-lg:w-full lg:w-[75vw] min-h-max overflow-hidden z-50">
  <div class="grid lg:py-5 box-border max-lg:grid-cols-1 lg:grid-cols-2 items-center overflow-hidden justify-evenly">
    <div class="font-semibold overflow-hidden text-lg">
      <h1 class="max-lg:hidden overflow-hidden">{$chat.chatName ?? userNamesJoined}</h1>
    </div>
    <div class="flex overflow-hidden items-center max-lg:w-[100vw] lg:place-self-end z-50">
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
