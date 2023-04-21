<script lang="ts">
  import Aside from '$lib/components/Aside/Aside.svelte';
  import { HubConnectionState } from '@microsoft/signalr';
  import { connection, previews } from '$lib/useSignalR';
  import { onDestroy, onMount } from 'svelte';
  import FriendsTabs from '$lib/components/FriendsTabs/FriendsTabs.svelte';
  import ActiveScreen from '$lib/components/MainScreen/ActiveScreen.svelte';

  onMount(async () => {
    if (connection.state === HubConnectionState.Disconnected) await connection.start();
    await connection.invoke('GetChatPreviews');
    await connection.invoke('GetFriends');
    await connection.invoke('GetFriendRequests');
  });
  onDestroy(async () => {
    await connection.stop();
  });
</script>

<title>ChattyBox</title>
<div class="grid grid-cols-4 w-screen">
  <aside class="col-span-1 bg-base-200 min-h-screen">
    <Aside chats={$previews} />
  </aside>
  <section class="col-span-3">
    <ActiveScreen />
  </section>
</div>
