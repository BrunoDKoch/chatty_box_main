<script lang="ts">
  import Hero from '$lib/components/Auth/Hero.svelte';
  import { t } from 'svelte-i18n';
</script>

<title>
  ChattyBox - {$t('auth.signup').replace(
    $t('auth.signup')[0],
    $t('auth.signup')[0].toUpperCase(),
  )}
  </title>
<Hero />
