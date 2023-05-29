<script lang="ts">
  import { fade } from 'svelte/transition';
  import useActiveScreen from '$lib/useActiveScreen';
  import { t } from 'svelte-i18n';
  import AsideMsg from './AsidePreview.svelte';
  import type { ChatPreview } from '$lib/types/partialTypes';
  import NewChatModal from './NewChatModal.svelte';
  import { friendRequests } from '$lib/useSignalR';
  import { previews } from '$lib/useSignalR';
  let showNewChatModal = false;
</script>

<div in:fade={{ delay: 150, duration: 100 }}>
  <button
    on:click={() => ($useActiveScreen = 'friends')}
    class="flex w-full py-2 gap-3 items-center cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700 {$friendRequests &&
    $friendRequests.length
      ? 'indicator'
      : ''} "
  >
    <iconify-icon class="text-2xl ml-2" icon="material-symbols:person" />
    <p class="capitalize">{$t('friends.friend', { values: { count: 2 } })}</p>
    {#if $friendRequests && $friendRequests.length}
      <div class="indicator-item indicator-middle right-5 badge badge-info">
        {$friendRequests.length}
      </div>
    {/if}
  </button>
  <div class="divider" />
  <button
    on:click={() => (showNewChatModal = !showNewChatModal)}
    class="flex w-full py-2 gap-3 items-center cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
  >
    <iconify-icon class="text-2xl ml-2" icon="mdi:chat-plus" />
    <p class="first-letter:capitalize">{$t('common.new.m')} chat</p>
  </button>
  <div class="divider" />
  <div class="flex flex-col gap-4 even:bg-base-300">
    {#each $previews as chat}
      <AsideMsg {chat} />
    {/each}
  </div>
</div>

{#if showNewChatModal}
  <NewChatModal on:close={() => (showNewChatModal = !showNewChatModal)} />
{/if}
