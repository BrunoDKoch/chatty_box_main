<script lang="ts">
  import { t } from 'svelte-i18n';
  import MainSettings from './MainSettings.svelte';
  import LanguageSettings from './LanguageSettings.svelte';
  import { fly } from 'svelte/transition';
  import UserNotifSettings from './UserNotifSettings.svelte';
  import type { SettingOptions } from '$lib/types/otherTypes';
  import SecuritySettings from './SecuritySettings.svelte';
  import PrivacySettings from './PrivacySettings.svelte';
  import StatusSettings from './StatusSettings.svelte';
  import Button from '../Custom/Button.svelte';
  import { page } from '$app/stores';
  let user: { userName: string; avatar?: string; status: '' | 'away' | 'busy' } = $page.data.user;
  let show = false;
  show = true;
  $: activeScreen = 'main' as 'main' | SettingOptions[number];
</script>

{#if show}
  <div class="h-full" transition:fly={{ delay: 100, duration: 75, x: -150 }}>
    {#if activeScreen !== 'main'}
      <div class="flex items-center">
        <Button
          id="back"
          format="ghost"
          size="large"
          additionalClasses="text-3xl"
          on:click={() => (activeScreen = 'main')}
        >
          <iconify-icon icon="mdi:arrow-left" />
        </Button>
        <h1 class="uppercase">{$t(activeScreen)}</h1>
      </div>
    {/if}
    {#if activeScreen === 'main'}
      <MainSettings on:changeActive={({ detail }) => (activeScreen = detail)} bind:user />
    {:else if activeScreen === 'settings.language'}
      <LanguageSettings />
    {:else if activeScreen === 'settings.notifications'}
      <UserNotifSettings />
    {:else if activeScreen === 'settings.security'}
      <SecuritySettings />
    {:else if activeScreen === 'settings.privacy'}
      <PrivacySettings />
    {:else if activeScreen === 'settings.status.status'}
      <StatusSettings bind:status={user.status} />
    {/if}
  </div>
{/if}
