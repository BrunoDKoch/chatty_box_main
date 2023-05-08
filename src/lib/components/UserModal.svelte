<script lang="ts">
  import type { ChatBasicInfo, UserPartialResponse } from '$lib/types/partialTypes';
  import { connection, friends } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import UserAvatarAndName from './UserAvatarAndName.svelte';
  import { onMount } from 'svelte';
  import CloseButton from './Custom/CloseButton.svelte';

  export let user: UserPartialResponse;
  let isFriend = !!$friends.find((f) => f.id === user.id);
  $: friendsInCommon = [] as UserPartialResponse[];
  $: chatsInCommon = [] as ChatBasicInfo[];
  connection.on(
    'userDetails',
    (
      data: UserPartialResponse & {
        friendsInCommon: UserPartialResponse[];
        chatsInCommon: ChatBasicInfo[];
      },
    ) => {
      console.log(data);
      user = { ...data };
      friendsInCommon = data.friendsInCommon;
      chatsInCommon = data.chatsInCommon;
    },
  );
  async function handleAddOrRemoveClick() {
    if (!isFriend) {
      await connection.invoke('SendFriendRequest', user.id);
      return;
    }
  }
  onMount(async () => {
    await connection.invoke('GetUserDetails', user.id);
  });
</script>

<Modal>
  <div>
    <div class="flex justify-end">
      <CloseButton on:close />
    </div>
    <div class="flex items-center">
      <UserAvatarAndName {user} size="full" />
      <div class="btn-group">
        <button class="btn btn-error">{$t('common.block')}</button>
        <button
          on:click={async () => await handleAddOrRemoveClick()}
          class="btn {isFriend ? 'btn-warning' : 'btn-success'}"
        >
          {$t(isFriend ? 'common.remove' : 'common.add', {
            values: { item: $t('friends.friend', { values: { count: 1 } }) },
          })}
        </button>
      </div>
    </div>
    {#if friendsInCommon && friendsInCommon.length}
      <div class="divider uppercase">
        {$t('friends.friend', { values: { count: 2 } })}
        {$t('common.inCommon')}
      </div>
      {#each friendsInCommon as friend}
        <UserAvatarAndName user={friend} size="half" />
      {/each}
    {/if}
    {#if chatsInCommon && chatsInCommon.length}
      <div class="divider uppercase">
        chats
        {$t('common.inCommon')}
      </div>
      {#each chatsInCommon as chat}
        <p>{chat.chatName}</p>
      {/each}
    {/if}
  </div>
</Modal>
