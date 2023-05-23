<script lang="ts">
  import type { CompleteChat, MessageResponse } from '$lib/types/combinationTypes';
  import { chat, chatId } from '$lib/useActiveChat';
  import { onMount } from 'svelte';
  import ChatNameComponent from './ChatNameComponent.svelte';
  import ChatSubmitter from './ChatSubmitter.svelte';
  import MessagesWrapper from './MessagesWrapper.svelte';
  import MainChatWrapper from './MainChatWrapper.svelte';
  import UserSearchModal from '$lib/components/Modals/UserSearchModal.svelte';
  import UserRemovalModal from '$lib/components/Modals/UserRemovalModal.svelte';
  import ChatNotificationsModal from '$lib/components/Modals/ChatNotificationsModal.svelte';

  let loading = true;
  let searchResults: { messages: MessageResponse[]; messageCount: number } = {
    messages: [],
    messageCount: 0,
  };
  $: $chatId, (loading = $chat.id !== $chatId);
  $: activeSearchPage = 1;
  let showUserSearchModal = false;
  let showUserRemovalModal = false;
  let showConfirmLeaveModal = false;
  let showNotificationsModal = false;
  // TODO: delete this logging
  onMount(() => console.log($chat));
</script>

{#if loading}
  <div class="w-full h-full flex items-center justify-center text-8xl">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{:else}
  <ChatNameComponent
    bind:activeSearchPage
    bind:searchResults
    on:openUserSearchModal={() => (showUserSearchModal = !showUserSearchModal)}
    on:openUserRemovalModal={() => (showUserRemovalModal = !showUserRemovalModal)}
    on:openNotificationsModal={() => (showNotificationsModal = !showNotificationsModal)}
  />
  <div
    class="grid {searchResults.messages && searchResults.messages.length
      ? 'grid-cols-3'
      : 'grid-cols-1'}"
  >
    <MainChatWrapper bind:searchResults bind:loading />
    {#if searchResults.messages && searchResults.messages.length}
      <MessagesWrapper
        systemMessages={[]}
        bind:messages={searchResults.messages}
        bind:total={searchResults.messageCount}
        bind:activePage={activeSearchPage}
        pagination
      />
    {/if}
  </div>
{/if}

{#if showUserSearchModal}
  <UserSearchModal on:close={() => (showUserSearchModal = !showUserSearchModal)} />
{:else if showUserRemovalModal}
  <UserRemovalModal on:close={() => (showUserRemovalModal = !showUserRemovalModal)} />
{:else if showNotificationsModal}
  <ChatNotificationsModal on:close={() => (showNotificationsModal = !showNotificationsModal)} />
{/if}
