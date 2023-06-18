<script lang="ts">
  import type { PageServerData } from './$types';
  import ReportsTable from '$lib/components/Admin/ReportsTable.svelte';
  import { connection } from '$lib/useSignalR';
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import AdminActionModal from '$lib/components/Admin/AdminActionModal.svelte';
  import SuspensionsTable from '$lib/components/Admin/SuspensionsTable.svelte';

  export let data: PageServerData;
  let { suspensions } = data;
  console.log(suspensions);
</script>

<SuspensionsTable users={suspensions} />
