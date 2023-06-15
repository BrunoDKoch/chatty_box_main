<script lang="ts">
  import ReportRow from './ReportRow.svelte';
  import type { UserReportResponse } from '$lib/types/combinationTypes';

  export let reports: UserReportResponse[];
</script>

<table class="table table-pin-rows max-md:table-sm">
  <thead>
    <tr>
      <th>Reason</th>
      <th>Reporting user</th>
      <th>Reported user</th>
      <th>Chat</th>
      <th>Message</th>
      <th>Sent at</th>
      <th/>
    </tr>
  </thead>
  <tbody>
    {#each reports as report}
      <ReportRow on:openModal bind:report />
    {/each}
  </tbody>
</table>
