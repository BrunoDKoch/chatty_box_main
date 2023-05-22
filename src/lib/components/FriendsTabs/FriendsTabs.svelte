<script lang="ts">
  import { t } from 'svelte-i18n';
  import SingleTab from './SingleTab.svelte';
  import { tabs } from '$lib/friendsTab';
  import FriendsModal from '$lib/components/Modals/FriendsModal.svelte';
  let showModal = false;
</script>

<div class="flex justify-between bg-base-200 p-2">
  <div class="flex">
    <div class="flex capitalize items-center">
      <iconify-icon icon="material-symbols:emoji-people" />
      <span>{$t('friends.friend', { values: { count: 2 } })}</span>
    </div>
    <div class="divider divider-horizontal" />
    {#each tabs as tab}
      <SingleTab name={tab} />
    {/each}
  </div>
  <button on:click={() => (showModal = true)} class="btn btn-success btn-sm">
    {$t('friends.add')}
  </button>
</div>

{#if showModal}
  <FriendsModal on:close={() => (showModal = !showModal)} />
{/if}
