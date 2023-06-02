<script lang="ts">
  import type { FriendResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chat, chatId } from '$lib/useActiveChat';
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import UserAvatar from '$lib/components/UserAvatar.svelte';
  import { createEventDispatcher } from 'svelte';
  export let friend: FriendResponse;
  const dispatch = createEventDispatcher();
  async function handleNewChat() {
    await connection.invoke('CreateNewChat', [friend.id], undefined, undefined);
    $useActiveScreen = 'chat';
    $chatId = $chat.id;
  }
</script>

<div class="py-3">
  <div class="grid grid-cols-5 indicator gap-3">
    <span class="indicator-item indicator-start {friend.isOnline ? 'badge badge-success' : ''}" />
    <UserAvatarAndName
      user={friend}
      size="half"
      extraText={friend.isOnline ? 'Online' : 'Offline'}
      lowerOpacity={!friend.isOnline}
    >
      <div class="btn-group {friend.isOnline ? 'opacity-100' : 'opacity-50'}">
        <button
          on:click={async () => await handleNewChat()}
          aria-label={$t('friends.newChat')}
          data-tip={$t('friends.newChat')}
          class="btn text-3xl tooltip"
        >
          <iconify-icon icon="mdi:message-plus" />
        </button>
        <button
          on:click={() => dispatch('remove', friend)}
          data-tip={$t('common.remove', {
            values: { item: $t('common.friend', { values: { count: 1 } }) },
          })}
          aria-label={$t('common.remove', {
            values: { item: $t('common.friend', { values: { count: 1 } }) },
          })}
          class="btn text-3xl btn-outline btn-error tooltip"
        >
          <iconify-icon icon="mdi:close" />
        </button>
      </div>
    </UserAvatarAndName>
  </div>
</div>
