<script lang="ts">
  import { t } from 'svelte-i18n';
  import SingleTab from './SingleTab.svelte';
  import { tabs } from '$lib/friendsTab';
  import FriendsModal from '../FriendsModal.svelte';
  let showModal = false;
</script>

<div class="flex justify-between bg-base-200 p-2">
  <div class="flex">
    <div class="flex capitalize items-center">
      <iconify-icon icon="material-symbols:emoji-people" />
      <span>{$t('common.friend')}s</span>
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
  <FriendsModal />
{/if}
