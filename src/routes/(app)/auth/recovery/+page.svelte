<script lang="ts">
  import { page } from '$app/stores';
  import Hero from '$lib/components/Auth/Hero.svelte';
  import { t } from 'svelte-i18n';
  let email = $page.url.searchParams.get('email') ?? '';
  let token = $page.url.searchParams.get('token') ?? '';
</script>

<title>
  ChattyBox - {$t('auth.recovery').replace(
    $t('auth.recovery')[0],
    $t('auth.recovery')[0].toUpperCase(),
  )}
</title>
<Hero {email} {token} />
