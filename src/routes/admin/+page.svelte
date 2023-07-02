<script lang="ts">
  import AdminActionModal from '$lib/components/Admin/AdminActionModal.svelte';
  import ReportsTable from '$lib/components/Admin/ReportsTable.svelte';
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { fetchedReports, reports } from '$lib/useAdminFetch';

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
