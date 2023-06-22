<script lang="ts">
    import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';

  const dispatch = createEventDispatcher();
  const links = [
    {
      name: $t('admin.pendingReports'),
      link: '/admin?p=1',
    },
    {
      name: $t('admin.past'),
      link: '/admin/past?p=1',
    },
    {
      name: $t('admin.suspended'),
      link: '/admin/suspensions?p=1',
    },
    {
      name: $t('admin.independent'),
    },
  ];
</script>

<ul class="menu bg-base-200 h-screen uppercase sticky top-0">
  {#each links as link}
    <li>
      {#if link.link}
        <a class="{$page.url.pathname === link.link ? 'active' : ''}" href={link.link}>
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
