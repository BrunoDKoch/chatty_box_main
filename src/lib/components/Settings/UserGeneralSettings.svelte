<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import UserAvatarModal from './Modals/UserAvatarModal.svelte';
  export let user: { userName: string; avatar?: string };
  $: showModal = false;
</script>

<div class="flex pl-2 gap-2 items-center">
  {#if user}
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
        <div
          class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 h-full"
        >
          <p class="text-center font-bold py-2 text-7xl">{user.userName[0]}</p>
        </div>
      {/if}
    </button>
    <p class="font-bold text-3xl">{user.userName}</p>
  {:else}
    <figure class="avatar mask w-24 h-24 mask-squircle">
      <div class="flex animate-pulse items-center bg-gray-300 dark:bg-gray-700 h-full" />
    </figure>
    <div class="w-36 h-6 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700" />
  {/if}
</div>
{#if showModal}
  <UserAvatarModal on:close={() => (showModal = !showModal)} />
{/if}

<style>
  .edit-avatar:hover iconify-icon {
    @apply opacity-100;
  }
  .edit-avatar:hover img,
  .edit-avatar:hover .h-full {
    @apply opacity-50;
  }
</style>
