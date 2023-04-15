<script lang="ts">
  import { t } from 'svelte-i18n';
  import SingleTab from './SingleTab.svelte';
  const tabs = [$t('friends.available'), $t('friends.pending'), $t('friends.blocked')];
</script>

<div class="flex justify-between bg-base-200 p-2">
  <div class="flex">
    <div class="flex capitalize items-center">
      <iconify-icon icon="material-symbols:emoji-people" />
      <span>{$t('common.friend')}s</span>
    </div>
    <div class="divider divider-horizontal"></div>
    {#each tabs as tab}
      <SingleTab name={tab} />
    {/each}
  </div>
  <button class="btn btn-success btn-sm">
    {$t('friends.add')}
  </button>
</div>
