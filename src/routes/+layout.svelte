<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ConnectingComponent from '$lib/components/ConnectingComponent.svelte';
  import { theme } from '$lib/theme';
  import useError from '$lib/useError';
  import { connection, online } from '$lib/useSignalR';
  import { HubConnectionState } from '@microsoft/signalr';
  import 'iconify-icon';
  import { ofetch } from 'ofetch';
  import { onDestroy, onMount } from 'svelte';
  import { locale, t } from 'svelte-i18n';
  import '../app.css';
  import type { LayoutServerData } from './$types';
  import useUserInfo from '$lib/useUserInfo';

  export let data: LayoutServerData;
  $theme = data.theme;
  $locale = data.lang;

  function handleThemeClass(node: HTMLElement, theme: 'light' | 'dark') {
    if (!theme) return;
    node.setAttribute('data-theme', theme);
    if (node.classList.contains('light')) {
      node.classList.replace('light', theme);
      return;
    }
    if (node.classList.contains('dark')) {
      node.classList.replace('dark', theme);
      return;
    }
    node.classList.add(theme);
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

  $: {
    if (!$page.url.pathname.includes('auth')) checkConnection().then((data) => data);
  }
  async function checkConnection() {
    if ($page.url.pathname.includes('auth')) return;
    try {
      if (connection.state === HubConnectionState.Disconnected) await connection.start();
      setTimeout(() => {
        $online = connection.state === HubConnectionState.Connected;
      }, 100);
    } catch (err) {
      if (
        (err as { message: string }).message.endsWith("Error: Unauthorized: Status code '401'") &&
        !$page.url.pathname.startsWith('/auth')
      )
        return goto('/auth/login');
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
    if (!$page.url.pathname.includes('auth') && data.user) useUserInfo(data.user);
    theme.subscribe(async (t) => await changeThemeCookie(t));
    locale.subscribe((l) =>
      document ? document.getElementsByTagName('html')[0].setAttribute('lang', l ? l : 'en') : null,
    );
    await checkConnection();
  });
  onDestroy(async () => await connection.stop());
</script>

<svelte:body use:setTheme />

<title>ChattyBox</title>

{#if $online || $page.url.pathname.includes('auth')}
  <slot />
{:else}
  <ConnectingComponent />
{/if}
