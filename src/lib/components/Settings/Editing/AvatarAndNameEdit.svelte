<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import { connection } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  export let showModal: boolean;
  export let user: { userName: string; avatar?: string };
  let editingName = false;
  async function handleSubmit() {
    await connection.invoke('ChangeUserName', user.userName);
    editingName = false;
  }
</script>

<button
  on:click={() => (showModal = !showModal)}
  class="avatar mask w-24 h-24 mask-squircle edit-avatar"
>
  <iconify-icon
    icon="mdi:image-edit"
    class="absolute opacity-0 self-center left-4 right-2 text-7xl"
  />
  {#if user.avatar}
    <img src="{PUBLIC_IMAGES_URL}/{user.avatar}?width=150" alt="" />
  {:else}
    <div class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 h-full">
      <p class="text-center font-bold py-2 text-7xl">{user.userName[0]}</p>
    </div>
  {/if}
</button>
<div class="flex gap-2 items-center">
  {#if editingName}
    <form on:submit|preventDefault={async () => await handleSubmit()} class="join" action="">
      <input bind:value={user.userName} class="input input-bordered" type="text" />
      <button class="btn">{$t('common.submit')}</button>
    </form>
  {:else}
    <p class="font-bold text-3xl">{user.userName}</p>
    <button on:click={() => (editingName = true)} class="btn btn-ghost">
      <iconify-icon icon="mdi:pencil" />
    </button>
  {/if}
</div>

<style>
  .edit-avatar:hover iconify-icon {
    @apply opacity-100;
  }
  .edit-avatar:hover img,
  .edit-avatar:hover .h-full {
    @apply opacity-50;
  }
</style>
