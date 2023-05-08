<script lang="ts">
  import { t } from 'svelte-i18n';
  import friendsTab from '$lib/friendsTab';
  import PendingScreen from './PendingScreen/PendingScreen.svelte';
  import { friendRequests } from '$lib/useSignalR';
  import FriendComponent from './FriendComponent.svelte';
  import type { FriendResponse } from '$lib/types/partialTypes';
  import FriendsTabs from '$lib/components/FriendsTabs/FriendsTabs.svelte';
  import { friends } from '$lib/useSignalR';
</script>

<FriendsTabs />
<div class="px-10 my-4 even:bg-base-200">
  {#if $friendsTab === 'friends.available'}
    {#if $friends.length}
      {#each $friends as friend}
        <FriendComponent {friend} />
      {/each}
    {:else}
      <h2 class="first-letter:uppercase">{$t('friends.noFriends')}</h2>
    {/if}
  {:else if $friendsTab === 'friends.pending'}
    <PendingScreen bind:requests={$friendRequests} />
  {/if}
</div>
