<script lang="ts">
  import { t } from 'svelte-i18n';
  import SingleTab from './SingleTab.svelte';
  import { tabs } from '$lib/friendsTab';
  import FriendsModal from '$lib/components/Modals/FriendsModal.svelte';
  import Button from '../Custom/Button.svelte';
  let showModal = false;
</script>

<div class="flex justify-between bg-base-200 p-2 items-center">
  <div class="flex">
    <div class="flex capitalize items-center">
      <iconify-icon icon="material-symbols:emoji-people" />
      <span class="max-md:hidden">{$t('friends.friend', { values: { count: 2 } })}</span>
    </div>
    <div class="divider divider-horizontal" />
    {#each tabs as tab}
      <SingleTab name={tab} />
    {/each}
  </div>
  <Button
    id="add-friend"
    tooltip={$t('friends.add')}
    on:click={() => (showModal = true)}
    buttonUIType="success"
    size="small"
    additionalClasses="text-xl"
  >
    <iconify-icon icon="material-symbols:person-add" />
  </Button>
</div>

{#if showModal}
  <FriendsModal on:close={() => (showModal = !showModal)} />
{/if}
