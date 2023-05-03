<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import { connection } from '$lib/useSignalR';
  import ChatScreen from './Chat/ChatScreen.svelte';
  import { chat, chatId } from '$lib/useActiveChat';
  $: $chatId, getChat().then((data) => data);
  async function getChat() {
    if ($useActiveScreen !== 'chat') return;
    console.log($chatId)
    await connection.invoke('GetChat', $chatId, 0);
  }
</script>

{#if $useActiveScreen === 'friends'}
  <FriendsScreen />
{:else if $useActiveScreen === 'chat'}
  <ChatScreen />
{/if}
