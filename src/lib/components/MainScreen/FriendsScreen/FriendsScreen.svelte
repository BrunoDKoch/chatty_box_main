<script lang="ts">
  import { t } from 'svelte-i18n';
  import friendsTab from '$lib/friendsTab';
  import PendingScreen from './PendingScreen/PendingScreen.svelte';
  import { connection, fetchingInitialCallInfo, friendRequests } from '$lib/useSignalR';
  import FriendComponent from './FriendComponent.svelte';
  import type { FriendResponse } from '$lib/types/partialTypes';
  import FriendsTabs from '$lib/components/FriendsTabs/FriendsTabs.svelte';
  import { friends } from '$lib/useSignalR';
  import BlockedScreen from './BlockedScreen/BlockedScreen.svelte';
  import ConfirmationModal from '$lib/components/Modals/ConfirmationModal.svelte';
  import SkeletonUserAvatarAndName from '$lib/components/SkeletonUserAvatarAndName.svelte';
  import SkeletonFriendComponent from './SkeletonFriendComponent.svelte';
  let showConfirmationModal = false;
  $: friendToRemove = null as (typeof $friends)[number] | null;
  async function handleDeletion() {
    if (!friendToRemove) return;
    await connection.invoke('RemoveFriend', friendToRemove.id);
    showConfirmationModal = false;
  }
</script>

<FriendsTabs />
<div class="px-10 my-4 even:bg-base-200">
  {#if $fetchingInitialCallInfo}
    {#each [0, 1, 2, 3, 4, 5] as _}
      <SkeletonFriendComponent />
    {/each}
  {:else if $friendsTab === 'friends.available'}
    {#if $friends.length}
      {#each $friends as friend}
        <FriendComponent
          on:remove={({ detail }) => {
            friendToRemove = detail;
            showConfirmationModal = true;
          }}
          {friend}
        />
      {/each}
    {:else}
      <h2 class="first-letter:uppercase">{$t('friends.noFriends')}</h2>
    {/if}
  {:else if $friendsTab === 'friends.pending'}
    <PendingScreen bind:requests={$friendRequests} />
  {:else}
    <BlockedScreen />
  {/if}
</div>

{#if showConfirmationModal}
  <ConfirmationModal
    on:confirm={async () => await handleDeletion()}
    on:deny={() => (showConfirmationModal = false)}
    action={$t('common.remove', { values: { item: friendToRemove?.userName } })}
  />
{/if}
