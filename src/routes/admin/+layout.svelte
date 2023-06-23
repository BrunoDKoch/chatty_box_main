<script lang="ts">
  import { page } from '$app/stores';
  import AdminAside from '$lib/components/Admin/AdminAside/AdminAside.svelte';
  import AdminNavBar from '$lib/components/Admin/AdminNavBar.svelte';
  import IndependentActionModal from '$lib/components/Admin/IndependentActionModal.svelte';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import {
    activeAdminPage,
    fetchedReports,
    fetchedSuspensions,
    getAdminData,
  } from '$lib/useAdminFetch';
  import { locale, t } from 'svelte-i18n';
  let showAsideInMain = false;
  let showIndependentActionModal = false;

  // Handle pages
  $: $activeAdminPage = Number($page.url.searchParams.get('p')) || 1;

  $: $page,
    getAdminData($page.url.pathname.endsWith('suspensions') ? 'suspensions' : 'reports', {
      activePage: $activeAdminPage,
      page: $page,
    }).then((data) => data);
</script>

<title>ChattyBox - {$t('admin.title')}</title>

<div class="h-screen overflow-y-auto">
  <AdminNavBar on:click={() => (showAsideInMain = !showAsideInMain)} />

  <div class="flex">
    <aside class="max-md:hidden">
      <AdminAside on:action={() => (showIndependentActionModal = !showIndependentActionModal)} />
    </aside>

    <main class="w-fit flex-1">
      {#if showAsideInMain}
        <AdminAside on:action={() => (showIndependentActionModal = !showIndependentActionModal)} />
      {:else}
        <div class="flex flex-col items-center justify-between">
          <slot />
          <Pagination
            useLinks
            itemsPerPage={15}
            total={$page.url.pathname.endsWith('suspensions')
              ? $fetchedSuspensions.total
              : $fetchedReports.total}
            bind:activePage={$activeAdminPage}
          />
        </div>
      {/if}
    </main>
  </div>

  {#if showIndependentActionModal}
    <IndependentActionModal
      on:close={() => (showIndependentActionModal = !showIndependentActionModal)}
    />
  {/if}
</div>
