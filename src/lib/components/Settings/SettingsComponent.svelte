<script lang="ts">
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import MainSettings from './MainSettings.svelte';
  import LanguageSettings from './LanguageSettings.svelte';
  let user: { userName: string; avatar?: string };
  $: settingsItems = [
    $t('settings.privacy'),
    $t('settings.security'),
    $t('settings.notifications'),
    $t('settings.language'),
    $t('settings.darkTheme'),
  ];
  $: activeScreen = 'main' as 'main' | (typeof settingsItems)[number];
  connection.on('userInfo', (data: typeof user) => (user = data));
  onMount(async () => await connection.invoke('GetCallerInfo'));
</script>

{#if activeScreen !== 'main'}
  <button class="btn" on:click={() => (activeScreen = 'main')}>
    <iconify-icon icon="mdi:arrow-left" />
  </button>
{/if}
{#if activeScreen === 'main'}
  <MainSettings on:changeActive={({ detail }) => (activeScreen = detail)} {user} {settingsItems} />
{:else if activeScreen === $t('settings.language')}
  <LanguageSettings />
{/if}
