<script lang="ts">
  import type { ReportUserResponse } from '$lib/types/combinationTypes';
  import SuspensionRow from './SuspensionRow.svelte';

  export let users: ReportUserResponse[];
</script>

<table class="table">
  <thead>
    <tr>
      <th>User</th>
      <th>Suspension</th>
      <th>Reason</th>
    </tr>
  </thead>
  {#each users as user}
    <SuspensionRow {user} />
  {/each}
</table>
