<script lang="ts">
  import { fade } from 'svelte/transition';
  import useActiveScreen from '$lib/useActiveScreen';
  import { t } from 'svelte-i18n';
  import AsideMsg from './AsidePreview.svelte';
  import type { ChatPreview } from '$lib/types/partialTypes';
  import NewChatModal from './NewChatModal.svelte';
  export let chats: ChatPreview[];
  let showNewChatModal = false;
</script>

<div in:fade={{ delay: 500, duration: 100 }}>
  <div
    on:keydown={() => ($useActiveScreen = 'friends')}
    on:click={() => ($useActiveScreen = 'friends')}
    class="flex py-2 gap-3 items-center cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
  >
    <iconify-icon icon="material-symbols:person" />
    <p class="capitalize">{$t('friends.friend', { values: { count: 2 } })}</p>
  </div>
  <div class="divider" />
  <button
    on:click={() => (showNewChatModal = !showNewChatModal)}
    class="flex w-full py-2 gap-3 items-center cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
  >
    <iconify-icon icon="mdi:chat-plus" />
    <p class="first-letter:capitalize">{$t('common.new.m')} chat</p>
  </button>
  <div class="divider" />
  <div class="flex flex-col gap-4 even:bg-base-300">
    {#each chats as chat}
      <AsideMsg {chat} />
    {/each}
  </div>
</div>

{#if showNewChatModal}
  <NewChatModal on:close={() => (showNewChatModal = !showNewChatModal)} />
{/if}
