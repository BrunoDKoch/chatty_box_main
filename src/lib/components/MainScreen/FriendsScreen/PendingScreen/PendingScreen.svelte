<script lang="ts">
  import type { FriendRequest, User } from '@prisma/client';
  import { connection } from '$lib/useSignalR';
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  export let requests: { userAdding: UserPartialResponse }[];
  async function handleClick(data: { userAdding: UserPartialResponse; accept: boolean }) {
    const { userAdding, accept } = data;
    await connection.invoke('RespondToFriendRequest', userAdding.id, accept);
    requests = requests.filter((u) => u.userAdding.id !== userAdding.id);
  }
</script>

<div>
  {#each requests as request}
    <div class="grid grid-cols-4">
      <UserAvatarAndName user={request.userAdding} size="half" />
      <div class="btn-group">
        <button
          on:click={async () => await handleClick({ userAdding: request.userAdding, accept: true })}
          class="btn btn-circle btn-success"
        >
          <iconify-icon icon="mdi:check" />
        </button>
        <button
          on:click={async () =>
            await handleClick({ userAdding: request.userAdding, accept: false })}
          class="btn btn-circle btn-error"
        >
          <iconify-icon icon="mdi:close" />
        </button>
      </div>
    </div>
  {/each}
</div>
