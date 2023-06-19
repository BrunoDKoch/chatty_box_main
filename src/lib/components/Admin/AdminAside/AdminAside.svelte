<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';

  const dispatch = createEventDispatcher();
  const links = [
    {
      name: $t('admin.pending'),
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

<ul class="menu bg-base-200 h-screen uppercase">
  {#each links as link}
    <li>
      {#if link.link}
        <a href={link.link}>
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
