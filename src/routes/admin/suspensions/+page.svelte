<script lang="ts">
  import SuspensionsTable from '$lib/components/Admin/SuspensionsTable.svelte';
  import { fetchedSuspensions } from '$lib/useAdminFetch';
</script>

<SuspensionsTable users={$fetchedSuspensions.users} />
