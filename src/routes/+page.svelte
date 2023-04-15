<script lang="ts">
  import Aside from '$lib/components/Aside/Aside.svelte';
  import { HubConnectionState } from '@microsoft/signalr';
  import { connection, previews } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import FriendsTabs from '$lib/components/FriendsTabs/FriendsTabs.svelte';

  onMount(async () => {
    if (connection.state !== HubConnectionState.Connected) await connection.start();
    await connection.invoke('GetMessagePreviews');
  });
</script>

<div class="grid grid-cols-4">
  <aside class="col-span-1 bg-base-200 min-h-screen">
    <Aside messages={$previews} />
  </aside>
  <section class="col-span-3">
    <FriendsTabs />
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
  </section>
</div>
