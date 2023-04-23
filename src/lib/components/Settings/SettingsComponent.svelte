<script lang="ts">
  import { t } from 'svelte-i18n';

  export let user: { userName: string; avatar?: string };
  let activeScreen: 'main' | 'privacy' = 'main';
  const settingsItems = [
    $t('settings.privacy'),
    $t('settings.security'),
    $t('settings.notifications'),
    $t('settings.language'),
    $t('settings.darkTheme'),
  ];
</script>

<div class="flex">
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
</div>
<menu class="menu">
  {#each settingsItems as item}
    <li class="uppercase">
      <a href="/" on:click|preventDefault>{item}</a>
    </li>
  {/each}
</menu>
