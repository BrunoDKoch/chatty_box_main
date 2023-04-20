<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import { connection, friends } from '$lib/useSignalR';
  import ChatScreen from './Chat/ChatScreen.svelte';
  import { chat, chatId } from '$lib/useActiveChat';
  $: $useActiveScreen, getChat($chatId).then((data) => data);
  async function getChat(chatId: string) {
    if ($useActiveScreen !== 'chat') return;
    await connection.invoke('GetChat', chatId);
  }
</script>

{#if $useActiveScreen === 'friends'}
  <FriendsScreen friends={$friends.sort((a, b) => Number(b.isOnline) - Number(a.isOnline))} />
{:else if $useActiveScreen === 'chat'}
  <ChatScreen chat={$chat} />
{/if}
