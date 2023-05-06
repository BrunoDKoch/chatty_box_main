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
  let friendsInCommon: UserPartialResponse[] = [];
  let chatsInCommon: ChatBasicInfo[] = []
  connection.on(
    'userDetails',
    (
      data: UserPartialResponse & {
        friendsInCommon: UserPartialResponse[];
        chatsInCommon: ChatBasicInfo[];
      },
    ) => {
      user = { ...data };
      friendsInCommon = data.friendsInCommon;
      chatsInCommon = data.chatsInCommon;
    },
  );
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
        <button class="btn {isFriend ? 'btn-warning' : 'btn-success'}">
          {$t(isFriend ? 'common.remove' : 'common.add', {
            values: { item: $t('friends.friend', { values: { count: 1 } }) },
          })}
        </button>
      </div>
    </div>
    {#if friendsInCommon && friendsInCommon.length}
      {#each friendsInCommon as friend}
        <UserAvatarAndName user={friend} size="half" />
      {/each}
    {/if}
  </div>
</Modal>
