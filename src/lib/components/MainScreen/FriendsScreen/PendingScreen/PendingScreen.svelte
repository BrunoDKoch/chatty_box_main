<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import PendingRequestComponent from './PendingRequestComponent.svelte';
  export let requests: { userAdding: UserPartialResponse }[];
  async function handleClick(data: { id: string; accept: boolean }) {
    const { id, accept } = data;
    await connection.invoke('RespondToFriendRequest', id, accept);
    requests = requests.filter((u) => u.userAdding.id !== id);
  }
</script>

<div>
  {#each requests as request}
    <PendingRequestComponent
      on:decision={async ({ detail }) => await handleClick(detail)}
      {request}
    />
  {/each}
</div>
