<script lang="ts">
  import Hero from '$lib/components/Auth/Hero.svelte';
  import { t } from 'svelte-i18n';
</script>

<title>
  ChattyBox - {$t('auth.login').replace($t('auth.login')[0], $t('auth.login')[0].toUpperCase())}
</title>
<Hero />
