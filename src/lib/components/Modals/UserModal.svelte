<script lang="ts">
  import type { UserDetailedResponse } from '$lib/types/partialTypes';
  import { blockedUsers, connection, friends } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import CloseButton from '../Custom/CloseButton.svelte';
  import { error } from '@sveltejs/kit';
  import useBlockToggle from '$lib/useBlockToggle';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chatId } from '$lib/useActiveChat';

  export let userId: string;
  const dispatch = createEventDispatcher();

  $: user = null as null | UserDetailedResponse;
  let innerWidth: number;

  // Sort chats in common by name
  $: {
    if (user) {
      sortChats(user);
    }
  }
  function sortChats(user: UserDetailedResponse) {
    user.chatsInCommon.sort((a, b) => {
      if (a.chatName! < b.chatName!) {
        return -1;
      }
      if (a.chatName! > b.chatName!) {
        return 1;
      }
      return 0;
    });
  }

  async function handleAddOrRemoveClick() {
    if (!user) return;
    if (!user.isFriend) {
      await connection.invoke('SendFriendRequest', user.id);
    } else await connection.invoke('RemoveFriend', user.id);
    setTimeout(async () => await updateUser(), 100);
  }
  async function handleBlockToggle() {
    try {
      const userResponse = await useBlockToggle(userId);
      if (userResponse.isBlocked) {
        $friends = $friends.filter((f) => f.id !== userResponse.id);
        $blockedUsers.push(userResponse);
        return;
      }
      $blockedUsers = $blockedUsers.filter((b) => b.id !== userResponse.id);
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

<Modal on:close>
  {#if user}
    <div>
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
        <div class="flex flex-col">
          {#each user.chatsInCommon as chat}
            <a
              class="link hover:text-gray-700 dark:hover:text-gray-300"
              href="/"
              on:click|preventDefault={() => {
                $useActiveScreen = 'chat';
                $chatId = chat.id;
                dispatch('close');
              }}>{chat.chatName}</a
            >
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</Modal>
