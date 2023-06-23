<script lang="ts">
  import type { PageServerData } from './$types';
  import ReportsTable from '$lib/components/Admin/ReportsTable.svelte';
  import { connection } from '$lib/useSignalR';
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import AdminActionModal from '$lib/components/Admin/AdminActionModal.svelte';
  import { page } from '$app/stores';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import {
    getAdminData,
    reports,
    totalReports,
    activeAdminPage,
    fetchedReports,
  } from '$lib/useAdminFetch';
  import { onMount } from 'svelte';

  let reportOpenedForAction = null as null | UserReportResponse;

</script>

<div class="flex flex-col overflow-auto">
  <ReportsTable
    on:openModal={({ detail }) => (reportOpenedForAction = detail)}
    bind:reports={$fetchedReports.reports}
  />
</div>

{#if reportOpenedForAction}
  <AdminActionModal
    on:close={() => (reportOpenedForAction = null)}
    bind:report={reportOpenedForAction}
  />
{/if}
