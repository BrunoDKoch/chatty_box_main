<script lang="ts">
  import AdminAside from '$lib/components/Admin/AdminAside/AdminAside.svelte';
  import AdminNavBar from '$lib/components/Admin/AdminNavBar.svelte';
  import IndependentActionModal from '$lib/components/Admin/IndependentActionModal.svelte';
  import { t } from 'svelte-i18n';
  let showAsideInMain = false;
  let showIndependentActionModal = false;
</script>

<title>ChattyBox - {$t('admin.title')}</title>

<AdminNavBar on:click={() => (showAsideInMain = !showAsideInMain)} />

<div class="flex w-screen">
  <aside class="max-md:hidden">
    <AdminAside on:action={() => (showIndependentActionModal = !showIndependentActionModal)} />
  </aside>

  <main class="w-fit flex-1">
    {#if showAsideInMain}
      <AdminAside on:action={() => (showIndependentActionModal = !showIndependentActionModal)} />
    {:else}
      <slot />
    {/if}
  </main>
</div>

{#if showIndependentActionModal}
  <IndependentActionModal on:close={() => (showIndependentActionModal = !showIndependentActionModal)} />
{/if}
