<script lang="ts">
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
</script>

<header class="navbar navbar-center bg-base-300 text-center">
  <div class="flex-1 max-md:hidden">
    <a href="/" class="btn btn-ghost lg:text-xl">
      <iconify-icon icon="material-symbols:keyboard-backspace" />
      {$t('common.return')}
    </a>
  </div>
  <div class="flex-1 lg:hidden">
    <Button format="ghost" on:click>
      <iconify-icon class="text-xl" icon="mdi:menu" />
    </Button>
  </div>
  <h1 class="font-bold lg:text-2xl uppercase">{$t('admin.title')}</h1>
</header>
