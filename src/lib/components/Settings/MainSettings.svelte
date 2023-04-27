<script lang="ts">
  import { t } from 'svelte-i18n';
  import { theme } from '$lib/theme';
  import { createEventDispatcher } from 'svelte';
  import UserGeneralSettings from './UserGeneralSettings.svelte';
  export let user: { userName: string; avatar?: string };
  export let settingsItems: string[];
  const dispatch = createEventDispatcher();
</script>

<UserGeneralSettings {user} />
<menu class="menu">
  {#each settingsItems as item}
    <li class="uppercase {user ? '' : 'disabled'}">
      <a
        aria-disabled={!user}
        href="/"
        on:click|preventDefault={() =>
          item === $t('settings.darkTheme') ? null : dispatch('changeActive', item)}
      >
        {#if item === $t('settings.darkTheme')}
          <span>
            {item}
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
          {item}
        {/if}
      </a>
    </li>
  {/each}
</menu>
