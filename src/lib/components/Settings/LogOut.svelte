<script lang="ts">
  import { t } from 'svelte-i18n';
  import { logOut } from '$lib/useAuth';
</script>

<a on:click|preventDefault={async () => await logOut()} href="/">
  {$t('auth.logout')}
</a>
