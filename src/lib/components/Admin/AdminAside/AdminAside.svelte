<script lang="ts">
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';

  const dispatch = createEventDispatcher();
  const links = [
    {
      name: $t('admin.pendingReports'),
      link: '/admin',
    },
    {
      name: $t('admin.past'),
      link: '/admin/past',
    },
    {
      name: $t('admin.suspended'),
      link: '/admin/suspensions',
    },
    {
      name: $t('admin.independent'),
    },
  ];
</script>

<ul class="menu menu-lg bg-base-200 h-screen uppercase sticky top-0">
  {#each links as link}
    <li>
      {#if link.link}
        <a class={$page.url.pathname.split('?')[0] === link.link ? 'active' : ''} href={link.link}>
          {link.name}
        </a>
      {:else}
        <a href="." on:click|preventDefault={() => dispatch('action')}>
          {link.name}
        </a>
      {/if}
    </li>
  {/each}
</ul>
