<script lang="ts">
  import SettingsComponent from '../Settings/SettingsComponent.svelte';
  import AsideSearch from './AsideSearch.svelte';
  import AsideMain from './AsideMain.svelte';
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  let settingsMenuActive = false;
</script>

<div class="flex flex-col gap-3 h-full max-lg:overflow-y-auto">
  <div class="flex items-center">
    <Button id="settings-toggle" on:click={() => (settingsMenuActive = !settingsMenuActive)} format="ghost">
      <iconify-icon icon="mdi:cog" height="1.4rem" />
    </Button>
    {#if settingsMenuActive}
      <h2 class="capitalize">{$t('common.settings')}</h2>
    {:else}
      <AsideSearch />
    {/if}
  </div>
  {#if settingsMenuActive}
    <SettingsComponent />
  {:else}
    <AsideMain />
  {/if}
</div>
