<script lang="ts">
  import { t } from 'svelte-i18n';
  import { theme } from '$lib/theme';
  import { createEventDispatcher } from 'svelte';
  export let user: { userName: string; avatar?: string };
  export let settingsItems: string[];
  const dispatch = createEventDispatcher();
</script>

<div class="flex">
  {#if user}
    <figure class="avatar mask w-24 h-24 mask-squircle">
      {#if user.avatar}
        <img src={user.avatar} alt="" />
      {:else}
        <div
          class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 h-full"
        >
          <p class="text-center font-bold py-2 text-7xl">{user.userName[0]}</p>
        </div>
      {/if}
    </figure>
    <p class="font-bold text-3xl">{user.userName}</p>
  {:else}
    <iconify-icon icon="svg-spinners:6-dots-scale" class="text-9xl" />
  {/if}
</div>
<menu class="menu">
  {#each settingsItems as item}
    <li class="uppercase">
      <a
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
