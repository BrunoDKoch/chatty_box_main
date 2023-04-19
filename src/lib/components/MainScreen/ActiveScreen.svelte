<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import { friends } from '$lib/useSignalR';
</script>

{#if $useActiveScreen === 'friends'}
  <FriendsScreen friends={$friends.sort((a, b) => Number(b.isOnline) - Number(a.isOnline))} />
{/if}
