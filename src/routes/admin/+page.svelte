<script lang="ts">
  import { t } from 'svelte-i18n';
  import type { PageServerData } from './$types';
  import { onMount } from 'svelte';
  import { error } from '@sveltejs/kit';
  import ReportsTable from '$lib/components/Admin/ReportsTable.svelte';
  import { connection } from '$lib/useSignalR';
  import { HubConnectionState } from '@microsoft/signalr';
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import AdminActionModal from '$lib/components/Admin/AdminActionModal.svelte';

  export let data: PageServerData;
  let { reports } = data;
  let reportOpenedForAction = null as null | UserReportResponse;
  connection.on('updateReport', (data: { id: string; violationFound: boolean }) => {
    const { id, violationFound } = data;
    const report = reports.find((r) => r.id === id);
    if (!report) return;
    report.violationFound = violationFound;
  });
</script>

<ReportsTable on:openModal={({ detail }) => (reportOpenedForAction = detail)} bind:reports />

{#if reportOpenedForAction}
  <AdminActionModal
    on:close={() => (reportOpenedForAction = null)}
    bind:report={reportOpenedForAction}
  />
{/if}
