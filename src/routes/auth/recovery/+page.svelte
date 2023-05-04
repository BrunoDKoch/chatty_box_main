<script lang="ts">
  import { page } from '$app/stores';
  import Hero from '$lib/components/Auth/Hero.svelte';
  let email = $page.url.searchParams.get('email') ?? '';
  let token = $page.url.searchParams.get('token') ?? '';
</script>

<Hero {email} {token} />

