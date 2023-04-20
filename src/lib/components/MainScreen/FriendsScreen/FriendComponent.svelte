<script lang="ts">
  import type { FriendResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chat, chatId } from '$lib/useActiveChat';
  export let friend: FriendResponse;
  async function handleNewChat() {
    await connection.invoke('CreateNewChat', [friend.userId], undefined, undefined);
    $useActiveScreen = 'chat';
    $chatId = $chat.id;
  }
</script>

<div class="py-3 {friend.isOnline ? 'opacity-100' : 'opacity-50'} ">
  <div class="grid grid-cols-5 indicator gap-3">
    <span class="indicator-item indicator-start {friend.isOnline ? 'badge badge-success' : ''}" />
    <figure class="avatar mask mask-squircle w-[50px] h-[50px]">
      {#if friend.avatar}
        <img src={friend.avatar} alt="" />
      {:else}
        <div
          class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 w-full h-full"
        >
          <p class="text-center font-bold py-2 text-3xl">{friend.userName[0]}</p>
        </div>
      {/if}
    </figure>
    <div class="col-span-3 flex flex-col">
      <p>{friend.userName}</p>
      <p>{friend.isOnline ? 'Online' : 'Offline'}</p>
    </div>
    <div class="btn-group">
      <button
        on:click={async () => await handleNewChat()}
        aria-label={$t('friends.newChat')}
        class="btn text-3xl"
      >
        <iconify-icon icon="mdi:message-plus" />
      </button>
      <button
        aria-label="{$t('common.remove')} {$t('common.friend')}"
        class="btn text-3xl btn-outline btn-error"
      >
        <iconify-icon icon="mdi:close" />
      </button>
    </div>
  </div>
</div>
