<script lang="ts">
  import type { FriendRequest, User } from '@prisma/client';
  import { connection } from '$lib/useSignalR';
  export let requests: (FriendRequest & { userAdding: User })[];
  async function handleClick(data: { userAdding: User; accept: boolean }) {
    const { userAdding, accept } = data;
    await connection.invoke('RespondToFriendRequest', userAdding.id, accept);
    requests = requests.filter((u) => u.userAddingId !== userAdding.id);
  }
</script>

<div>
  {#each requests as request}
    <div class="grid grid-cols-4">
      <figure class="avatar w-12">
        {#if request.userAdding.avatar}
          <img src={request.userAdding.avatar} alt="" />
        {:else}
          <p class="w-12 p-auto bg-base-200 flex items-center justify-center">
            {request.userAdding.userName ? request.userAdding.userName[0] : ''}
          </p>
        {/if}
      </figure>

      <p class="col-span-2">
        {request.userAdding.userName}
      </p>
      <div class="btn-group">
        <button
          on:click={async () => await handleClick({ userAdding: request.userAdding, accept: true })}
          class="btn btn-circle btn-outline btn-success"
        >
          <iconify-icon icon="mdi:check" />
        </button>
        <button
          on:click={async () =>
            await handleClick({ userAdding: request.userAdding, accept: false })}
          class="btn btn-circle btn-outline btn-error"
        >
          <iconify-icon icon="mdi:close" />
        </button>
      </div>
    </div>
  {/each}
</div>
