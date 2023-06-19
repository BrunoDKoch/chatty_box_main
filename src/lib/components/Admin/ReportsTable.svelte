<script lang="ts">
  import ReportRow from './ReportRow.svelte';
  import type { UserReportResponse } from '$lib/types/combinationTypes';

  export let reports: UserReportResponse[];
  let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

<table class="table table-pin-rows max-md:table-xs">
  <thead>
    <tr>
      <th>Reason</th>
      <th class="max-md:hidden" >Reporting user</th>
      <th>Reported user</th>
      <th class="max-md:hidden" >Chat</th>
      <th>Message</th>
      <th class="max-md:hidden">Sent at</th>
      <th class="max-sm:hidden">Action</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#each reports as report}
      <ReportRow showAvatar={innerWidth > 1024} on:openModal bind:report />
    {/each}
  </tbody>
</table>
