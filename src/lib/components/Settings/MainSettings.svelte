<script lang="ts">
  import { t } from 'svelte-i18n';
  import { theme } from '$lib/theme';
  import { createEventDispatcher } from 'svelte';
  import UserGeneralSettings from './UserGeneralSettings.svelte';
  import { type SettingOptions, settingOptions } from '$lib/types/otherTypes';
  import LogOut from './LogOut.svelte';
  export let user: { userName: string; avatar?: string };
  const dispatch = createEventDispatcher();
</script>

<UserGeneralSettings {user} />
<menu class="menu menu-lg">
  {#each settingOptions as item}
    <li class="uppercase {user ? '' : 'disabled'}">
      <a
        aria-disabled={!user}
        href="/"
        on:click|preventDefault={() =>
          item === 'settings.darkTheme' ? null : dispatch('changeActive', item)}
      >
        {#if item === 'settings.darkTheme'}
          <span>
            {$t(item)}
          </span>
          <input
            type="checkbox"
            name="theme"
            id="theme"
            class="toggle"
            disabled={!user}
            on:click|stopPropagation={() => ($theme = $theme === 'dark' ? 'light' : 'dark')}
            checked={$theme === 'dark'}
          />
        {:else}
          {$t(item)}
        {/if}
      </a>
    </li>
  {/each}
  <li class="uppercase">
    <LogOut />
  </li>
</menu>
