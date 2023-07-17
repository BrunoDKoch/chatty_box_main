<script lang="ts">
  import { t } from 'svelte-i18n';
</script>

<form class="flex" action="?/logout" method="post">
  <button class="uppercase w-full text-start">
    {$t('auth.logout')}
  </button>
</form>
