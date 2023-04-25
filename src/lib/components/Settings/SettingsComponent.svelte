<script lang="ts">
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import MainSettings from './MainSettings.svelte';
  import LanguageSettings from './LanguageSettings.svelte';
  import { fly, slide } from 'svelte/transition';
  let user: { userName: string; avatar?: string };
  let show = false;
  show = true;
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

{#if show}
  <div transition:slide>
    {#if activeScreen !== 'main'}
      <div class="flex items-center">
        <button class="btn btn-ghost btn-xl text-3xl" on:click={() => (activeScreen = 'main')}>
          <iconify-icon icon="mdi:arrow-left" />
        </button>
        <h1 class="uppercase">{activeScreen}</h1>
      </div>
    {/if}
    {#if activeScreen === 'main'}
      <MainSettings
        on:changeActive={({ detail }) => (activeScreen = detail)}
        {user}
        {settingsItems}
      />
    {:else if activeScreen === $t('settings.language')}
      <LanguageSettings />
    {/if}
  </div>
{/if}
