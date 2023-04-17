<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import { connection } from '$lib/useSignalR';
  import type { User } from '@prisma/client';
  import { onMount } from 'svelte';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  const friends: { userName: string; isOnline: boolean }[] = [];
  connection.on('friends', (data: typeof friends) => {
    friends.push(...data);
  });
</script>

{#if $useActiveScreen === 'friends'}
  <FriendsScreen {friends} />
{/if}
