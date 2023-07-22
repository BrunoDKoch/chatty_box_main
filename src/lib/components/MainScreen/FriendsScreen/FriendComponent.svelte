<script lang="ts">
  import type { FriendResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chat, activeChatId } from '$lib/useActiveChat';
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import { createEventDispatcher } from 'svelte';
  import StatusIndicator from '$lib/components/Status/StatusIndicator.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import type { ActionButton } from '$lib/types/otherTypes';
  export let friend: FriendResponse;
  const dispatch = createEventDispatcher();
  const actionButtons: ActionButton[] = [
    {
      async action() {
        await handleNewChat();
      },
      icon: 'mdi:chat-plus',
      uiType: 'neutral',
      tooltip: $t('friends.newChat'),
      id: 'new-chat',
    },
    {
      action() {
        dispatch('remove', friend);
      },
      icon: 'mdi:close',
      uiType: 'error',
      tooltip: $t('common.remove', {
        values: { item: $t('common.friend', { values: { count: 1 } }) },
      }),
      id: 'remove-friend',
    },
  ];
  async function handleNewChat() {
    await connection.invoke('CreateNewChat', [friend.id], undefined, undefined);
    $useActiveScreen = 'chat';
    $activeChatId = $chat.id;
  }
</script>

<div class="py-5">
  <div class="grid grid-cols-2 indicator lg:gap-3">
    <StatusIndicator bind:status={friend.status} bind:isOnline={friend.isOnline} />
    <UserAvatarAndName
      user={friend}
      size="half"
      extraText={!friend.isOnline ? 'Offline' : friend.status || 'Online'}
      lowerOpacity={!friend.isOnline}
    >
      <div class="join {friend.isOnline ? 'opacity-100' : 'opacity-50'}">
        {#each actionButtons as { id, action, tooltip, uiType: buttonUIType, icon }}
          <Button
            {id}
            on:click={async () => await action()}
            {tooltip}
            {buttonUIType}
            format="outline"
            additionalClasses="max-lg:btn-md lg:text-3xl max-lg:text-xl"
            joinItem
          >
            <iconify-icon {icon} />
          </Button>
        {/each}
      </div>
    </UserAvatarAndName>
  </div>
</div>
