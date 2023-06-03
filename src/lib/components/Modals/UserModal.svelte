<script lang="ts">
  import type {
    ChatBasicInfo,
    UserDetailedResponse,
    UserPartialResponse,
  } from '$lib/types/partialTypes';
  import { connection, friends } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import { onMount } from 'svelte';
  import CloseButton from '../Custom/CloseButton.svelte';
  import { error } from '@sveltejs/kit';

  export let userId: string;
  $: user = null as null | UserDetailedResponse;
  let innerWidth: number;
  async function handleAddOrRemoveClick() {
    if (!user) return;
    if (!user.isFriend) {
      await connection.invoke('SendFriendRequest', user.id);
    } else await connection.invoke('RemoveFriend', user.id);
    setTimeout(async () => await updateUser(), 100);
  }
  async function handleBlockToggle() {
    try {
      await connection.invoke('ToggleBlock', userId);
    } catch (err) {
      throw error((err as any).status, err as any);
    } finally {
      setTimeout(async () => await updateUser(), 100);
    }
  }
  async function updateUser() {
    user = await connection.invoke<UserDetailedResponse>('GetUserDetails', userId);
    user = user;
    console.log(user);
  }
  onMount(async () => await updateUser());
</script>

<svelte:window bind:innerWidth />

<Modal>
  {#if user}
    <div>
      <div class="flex justify-end">
        <CloseButton on:close />
      </div>
      <div class="flex items-center">
        <UserAvatarAndName disableModal {user} size={innerWidth > 1024 ? 'full' : 'half'}>
          <div class="join">
            <button
              disabled={user.isBlocking}
              on:click={async () => await handleBlockToggle()}
              class="btn join-item tooltip max-md:btn-md max-md:text-xl lg:text-3xl btn-error {user.isBlocking
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
              class="btn join-item tooltip max-md:btn-md max-md:text-xl lg:text-3xl {user.isFriend
                ? 'btn-warning'
                : 'btn-success'} {user.isBlocking ? 'btn-disabled' : ''}"
              data-tip={$t(user.isFriend ? 'common.remove' : 'common.add', {
                values: { item: $t('friends.friend', { values: { count: 1 } }) },
              })}
              aria-label={$t(user.isFriend ? 'common.remove' : 'common.add', {
                values: { item: $t('friends.friend', { values: { count: 1 } }) },
              })}
            >
              <iconify-icon icon={user.isFriend ? 'mdi:account-minus' : 'mdi:account-plus'} />
            </button>
          </div>
        </UserAvatarAndName>
      </div>
      {#if user && user.friendsInCommon.length}
        <div class="divider uppercase">
          {$t('friends.friend', { values: { count: 2 } })}
          {$t('common.inCommon')}
        </div>
        {#each user.friendsInCommon as friend}
          <UserAvatarAndName disableModal user={friend} size="half" />
        {/each}
      {/if}
      {#if user && user.chatsInCommon.length}
        <div class="divider uppercase">
          chats
          {$t('common.inCommon')}
        </div>
        {#each user.chatsInCommon as chat}
          <p>{chat.chatName}</p>
        {/each}
      {/if}
    </div>
  {/if}
</Modal>
