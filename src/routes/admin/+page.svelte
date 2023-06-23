<script lang="ts">
  import type { PageServerData } from './$types';
  import ReportsTable from '$lib/components/Admin/ReportsTable.svelte';
  import { connection } from '$lib/useSignalR';
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import AdminActionModal from '$lib/components/Admin/AdminActionModal.svelte';
  import { activeAdminPage, fetchedReports, getAdminData, reports, totalReports } from '$lib/useAdminFetch';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let reportOpenedForAction = null as null | UserReportResponse;
</script>

{#if $reports}
  <ReportsTable
    on:openModal={({ detail }) => (reportOpenedForAction = detail)}
    bind:reports={$fetchedReports.reports}
  />
{/if}

{#if reportOpenedForAction}
  <AdminActionModal
    on:close={() => (reportOpenedForAction = null)}
    bind:report={reportOpenedForAction}
  />
{/if}
