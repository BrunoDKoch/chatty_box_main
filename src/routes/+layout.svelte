<script lang="ts">
  import '../app.css';
  import 'iconify-icon';
  import { onMount } from 'svelte';
  import type { LayoutServerData } from './$types';
  import { page } from '$app/stores';
  import { theme } from '$lib/theme';
  import { ofetch } from 'ofetch';
  export let data: LayoutServerData;

  $theme = data.theme;

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

  onMount(async () => {
    theme.subscribe(async (t) => await changeThemeCookie(t));
  });
</script>

<svelte:body use:setTheme />


<main class="dark:bg-black min-h-screen">
  <slot />
</main>
