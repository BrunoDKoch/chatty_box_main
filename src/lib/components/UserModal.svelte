<script lang="ts">
  import type {
    ChatBasicInfo,
    UserDetailedResponse,
    UserPartialResponse,
  } from '$lib/types/partialTypes';
  import { connection, friends } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import UserAvatarAndName from './UserAvatarAndName.svelte';
  import { onMount } from 'svelte';
  import CloseButton from './Custom/CloseButton.svelte';
  import { error } from '@sveltejs/kit';

  export let user: UserPartialResponse | UserDetailedResponse;
  let innerWidth: number;
  let isFriend = !!$friends.find((f) => f.id === user.id);
  $: friendsInCommon = [] as UserPartialResponse[];
  $: chatsInCommon = [] as ChatBasicInfo[];
  connection.on('userDetails', (data: UserDetailedResponse) => {
    user = { ...data };
    friendsInCommon = data.friendsInCommon;
    chatsInCommon = data.chatsInCommon;
  });
  async function handleAddOrRemoveClick() {
    if (!isFriend) {
      await connection.invoke('SendFriendRequest', user.id);
      return;
    }
    setTimeout(async () => await connection.invoke('GetUserDetails', user.id), 100);
  }
  async function handleBlockToggle() {
    try {
      await connection.invoke('ToggleBlock', user.id);
    } catch (err) {
      throw error((err as any).status, err as any);
    } finally {
      setTimeout(async () => await connection.invoke('GetUserDetails', user.id), 100);
    }
  }
  onMount(async () => {
    await connection.invoke('GetUserDetails', user.id);
    console.log(user);
  });
</script>

<svelte:window bind:innerWidth />

<Modal>
  <div>
    <div class="flex justify-end">
      <CloseButton on:close />
    </div>
    <div class="flex items-center">
      <UserAvatarAndName disableModal {user} size={innerWidth > 1024 ? 'full' : 'half'}>
        <div class="btn-group">
          <button
            disabled={user.isBlocking}
            on:click={async () => await handleBlockToggle()}
            class="btn tooltip max-md:btn-md max-md:text-xl lg:text-3xl btn-error {user.isBlocking
              ? 'btn-disabled'
              : ''}"
            data-tip={$t(user.isBlocked ? 'common.unblock' : 'common.block')}
            aria-label={$t(user.isBlocked ? 'common.unblock' : 'common.block')}
          >
            <iconify-icon icon={user.isBlocked ? 'mdi:account-lock-open' : 'mdi:block-helper'} />
          </button>
          <button
            disabled={user.isBlocking}
            on:click={async () => await handleAddOrRemoveClick()}
            class="btn tooltip max-md:btn-md max-md:text-xl lg:text-3xl {isFriend
              ? 'btn-warning'
              : 'btn-success'} {user.isBlocking ? 'btn-disabled' : ''}"
            data-tip={$t(isFriend ? 'common.remove' : 'common.add', {
              values: { item: $t('friends.friend', { values: { count: 1 } }) },
            })}
            aria-label={$t(isFriend ? 'common.remove' : 'common.add', {
              values: { item: $t('friends.friend', { values: { count: 1 } }) },
            })}
          >
            <iconify-icon icon={isFriend ? 'mdi:account-minus' : 'mdi:account-plus'} />
          </button>
        </div>
      </UserAvatarAndName>
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
