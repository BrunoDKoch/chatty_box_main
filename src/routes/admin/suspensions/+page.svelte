<script lang="ts">
  import { page } from '$app/stores';
  import SuspensionsTable from '$lib/components/Admin/SuspensionsTable.svelte';
  import { activeAdminPage, fetchedSuspensions, getAdminData } from '$lib/useAdminFetch';
  import { onMount } from 'svelte';
</script>

<SuspensionsTable users={$fetchedSuspensions.users} />
