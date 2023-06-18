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
  import { updateUser } from '$lib/useUserModal';
    import type { ActionButton } from '$lib/types/otherTypes';
    import Button from '../Custom/Button.svelte';

  export let user: UserDetailedResponse;
  const dispatch = createEventDispatcher();

  let innerWidth: number;

  // Sort chats in common by name
  $: {
    if (user) {
      sortChats(user);
    }
  }
  const actionButtons: ActionButton[] = [
    {
      async action() {
        await handleBlockToggle()
      },
      uiType: 'error',
      icon: user.isBlocked ? 'mdi:account-lock-open' : 'mdi:block-helper',
      tooltip: $t(user.isBlocked ? 'common.unblock' : 'common.block'),
    },
    {
async      action() {
        await handleAddOrRemoveClick()
      },
      uiType: user.isFriend ? 'warning' : 'success',
      tooltip: $t(user.isFriend ? 'common.remove' : 'common.add', {
                values: { item: $t('friends.friend', { values: { count: 1 } }) },
              }),
      icon: user.isFriend ? 'mdi:account-minus' : 'mdi:account-plus'
    }
  ]
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
    setTimeout(async () => await updateUser(user), 100);
  }
  async function handleBlockToggle() {
    try {
      const userResponse = await useBlockToggle(user.id);
      if (userResponse.isBlocked) {
        $friends = $friends.filter((f) => f.id !== userResponse.id);
        $blockedUsers.push(userResponse);
        return;
      }
      $blockedUsers = $blockedUsers.filter((b) => b.id !== userResponse.id);
    } catch (err) {
      throw error((err as any).status, err as any);
    } finally {
      setTimeout(async () => await updateUser(user), 100);
    }
  }
</script>

<svelte:window bind:innerWidth />

<Modal on:close>
  {#if user}
    <div>
      <div class="flex items-center">
        <UserAvatarAndName disableModal {user} size={innerWidth > 1024 ? 'full' : 'half'}>
          <div class="join">
            {#each actionButtons as actionButton}
            <Button
              joinItem
              disabled={user.isBlocking}
              on:click={async () => await actionButton.action()}
              buttonUIType={actionButton.uiType}
              className="max-md:btn-md max-md:text-xl lg:text-3xl"
              tooltip={actionButton.tooltip}
            >
              <iconify-icon icon={actionButton.icon} />
            </Button>
            {/each}
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
