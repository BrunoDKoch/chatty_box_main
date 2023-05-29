<script lang="ts">
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import MainSettings from './MainSettings.svelte';
  import LanguageSettings from './LanguageSettings.svelte';
  import { fly, slide } from 'svelte/transition';
  import UserNotifSettings from './UserNotifSettings.svelte';
  import type { SettingOptions } from '$lib/types/otherTypes';
  import SecuritySettings from './SecuritySettings.svelte';
  import PrivacySettings from './PrivacySettings.svelte';
  let user: { userName: string; avatar?: string };
  let show = false;
  show = true;
  $: activeScreen = 'main' as 'main' | SettingOptions[number];
  connection.on('userInfo', (data: typeof user) => (user = data));
  onMount(async () => await connection.invoke('GetCallerInfo'));
</script>

{#if show}
  <div transition:fly={{ duration: 75, x: -150 }}>
    {#if activeScreen !== 'main'}
      <div class="flex items-center">
        <button class="btn btn-ghost btn-xl text-3xl" on:click={() => (activeScreen = 'main')}>
          <iconify-icon icon="mdi:arrow-left" />
        </button>
        <h1 class="uppercase">{$t(activeScreen)}</h1>
      </div>
    {/if}
    {#if activeScreen === 'main'}
      <MainSettings on:changeActive={({ detail }) => (activeScreen = detail)} {user} />
    {:else if activeScreen === 'settings.language'}
      <LanguageSettings />
    {:else if activeScreen === 'settings.notifications'}
      <UserNotifSettings />
    {:else if activeScreen === 'settings.security'}
      <SecuritySettings />
    {:else if activeScreen === 'settings.privacy'}
      <PrivacySettings />
    {/if}
  </div>
{/if}
