<script lang="ts">
  import Aside from '$lib/components/Aside/Aside.svelte';
  import { HubConnectionState } from '@microsoft/signalr';
  import { connection, previews } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import FriendsTabs from '$lib/components/FriendsTabs/FriendsTabs.svelte';
  import ActiveScreen from '$lib/components/MainScreen/ActiveScreen.svelte';

  onMount(async () => {
    if (connection.state !== HubConnectionState.Connected) await connection.start();
    await connection.invoke('GetMessagePreviews');
    await connection.invoke('GetFriends');
  });
</script>

<title>ChattyBox</title>
<div class="grid grid-cols-4">
  <aside class="col-span-1 bg-base-200 min-h-screen">
    <Aside messages={$previews} />
  </aside>
  <section class="col-span-3">
    <FriendsTabs />
    <ActiveScreen />
  </section>
</div>
