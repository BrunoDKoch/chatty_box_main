<script lang="ts">
  import '../app.css';
  import 'iconify-icon';
  import { onDestroy, onMount } from 'svelte';
  import type { LayoutServerData } from './$types';
  import { locale } from 'svelte-i18n';
  import { theme } from '$lib/theme';
  import { ofetch } from 'ofetch';
  import { connection, online } from '$lib/useSignalR';
  import { HubConnectionState } from '@microsoft/signalr';
  import { goto } from '$app/navigation';
  import useError from '$lib/useError';
  import { t } from 'svelte-i18n';
  import { page } from '$app/stores';
  import ConnectingComponent from '$lib/components/ConnectingComponent.svelte';
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';
  export let data: LayoutServerData;
  $theme = data.theme;

  $: $page.url, checkConnection().then((data) => data);

  function handleThemeClass(node: HTMLElement, theme: 'light' | 'dark') {
    if (!theme) return;
    node.setAttribute('data-theme', theme);
    node.className = theme;
  }

  async function changeThemeCookie(theme: 'light' | 'dark' | null) {
    if (!theme) return;
    await ofetch('/api/theme', {
      query: {
        theme,
      },
    });
    const body = document.getElementsByTagName('body')[0];
    handleThemeClass(body, theme);
  }

  function setTheme(node: HTMLElement) {
    const darkThemeConditions =
      $theme === 'dark' ||
      (!$theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (darkThemeConditions) handleThemeClass(node, 'dark');
    else handleThemeClass(node, 'light');
  }

  async function checkConnection() {
    if ($page.url.pathname.includes('auth')) return;
    try {
      if (connection.state === HubConnectionState.Disconnected) await connection.start();
      setTimeout(() => {
        $online = connection.state === HubConnectionState.Connected;
      }, 100);
    } catch (err) {
      if ((err as { message: string }).message.endsWith("Error: Unauthorized: Status code '401'"))
        return await goto('/auth/login');
      $useError = {
        status: 503,
        cause: $t('error.cause.503'),
        message: `${$t('error.signalR', {
          values: { error: (err as { message: string }).message },
        })}\n ${$t('error.ourEnd')}\n ${$t('error.contactSupport')}`,
      };
    }
  }
  onMount(async () => {
    theme.subscribe(async (t) => await changeThemeCookie(t));
    locale.subscribe((l) =>
      document ? document.getElementsByTagName('html')[0].setAttribute('lang', l ? l : 'en') : null,
    );
    await checkConnection();
  });
  onDestroy(async () => {
    if (connection.state !== HubConnectionState.Connected) return;
    await connection.stop();
  });
</script>

<title>ChattyBox</title>

<svelte:body use:setTheme />

<main class="dark:bg-black h-screen w-screen overflow-hidden">
  {#if $online || $page.url.pathname.includes('auth') || $page.error}
    <slot />
  {:else}
    <ConnectingComponent />
  {/if}
</main>

{#if $useError}
  <ErrorModal error={$useError} on:close={() => ($useError = null)} />
{/if}
