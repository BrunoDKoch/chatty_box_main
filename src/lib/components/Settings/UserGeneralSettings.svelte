<script lang="ts">
  import AvatarAndNameEdit from './Editing/AvatarAndNameEdit.svelte';
  import UserAvatarModal from '../Modals/UserAvatarModal.svelte';
  export let user: { userName: string; avatar?: string };
  $: showModal = false;
  async function handleFileUpdate(file: string | null) {
    user.avatar = file ?? undefined;
  }
</script>

<div class="flex pl-2 gap-2 items-center">
  {#if user}
    <AvatarAndNameEdit bind:showModal bind:user />
  {:else}
    <figure class="avatar mask w-24 h-24 mask-squircle">
      <div class="flex animate-pulse items-center bg-gray-300 dark:bg-gray-700 h-full" />
    </figure>
    <div class="w-36 h-6 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700" />
  {/if}
</div>
{#if showModal}
  <UserAvatarModal
    on:updateFile={async ({ detail }) => await handleFileUpdate(detail)}
    on:close={() => (showModal = !showModal)}
  />
{/if}
