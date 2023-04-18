<script lang="ts">
  import { t } from 'svelte-i18n';
  import friendsTab from '$lib/friendsTab';
  import PendingScreen from './PendingScreen/PendingScreen.svelte';
  import { friendRequests } from '$lib/useSignalR';
  export let friends: { userName: string; isOnline: boolean }[];
  console.log(friends)
</script>

{#if $friendsTab === 'friends.available'}
  {#if friends.length}
    {#each friends as friend}
      <div>
        <figure class="avatar">
          <span>{friend.userName[0]}</span>
        </figure>
        <p>{friend.userName}</p>
        <p>{friend.isOnline ? 'Online' : 'Offline'}</p>
      </div>
    {/each}
  {:else}
    <h2 class="first-letter:uppercase">{$t('friends.noFriends')}</h2>
  {/if}
{:else if $friendsTab === 'friends.pending'}
  <PendingScreen requests={$friendRequests} />
{/if}
