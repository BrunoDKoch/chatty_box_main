<script lang="ts">
  import AdminAside from '$lib/components/Admin/AdminAside/AdminAside.svelte';
  import { t } from 'svelte-i18n';
</script>

<title>ChattyBox - {$t('admin.title')}</title>

<div class="flex w-screen">
  <aside>
    <AdminAside />
  </aside>

  <main class="min-w-max flex-auto">
    <slot />
  </main>
</div>
