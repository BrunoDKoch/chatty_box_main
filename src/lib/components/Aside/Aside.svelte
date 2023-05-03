<script lang="ts">
  import SettingsComponent from '../Settings/SettingsComponent.svelte';

  import type { ChatPreview } from '$lib/types/partialTypes';
  import AsideSearch from './AsideSearch.svelte';
  import AsideMain from './AsideMain.svelte';
  import { t } from 'svelte-i18n';
  export let chats: ChatPreview[];
  let settingsMenuActive = false;
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center">
    <button on:click={() => (settingsMenuActive = !settingsMenuActive)} class="btn btn-ghost">
      <iconify-icon icon="mdi:menu" height="1.4rem" />
    </button>
    {#if settingsMenuActive}
      <h2 class="capitalize">{$t('common.settings')}</h2>
    {:else}
      <AsideSearch />
    {/if}
  </div>
  {#if settingsMenuActive}
    <SettingsComponent />
  {:else}
    <AsideMain {chats} />
  {/if}
</div>
