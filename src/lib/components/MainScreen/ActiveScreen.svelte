<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import { connection, previews } from '$lib/useSignalR';
  import ChatScreen from './Chat/ChatScreen.svelte';
  import { chatId } from '$lib/useActiveChat';
  import Aside from '../Aside/Aside.svelte';
  $: $chatId, getChat().then((data) => data);
  async function getChat() {
    if ($useActiveScreen !== 'chat') return;
    await connection.invoke('GetChat', $chatId, 0);
  }
</script>

{#if $useActiveScreen === 'friends'}
  <FriendsScreen />
{:else if $useActiveScreen === 'chat'}
  <ChatScreen />
{:else if $useActiveScreen === 'aside'}
  <Aside chats={$previews} />
{/if}
