<script lang="ts">
  import ReportRow from './ReportRow.svelte';
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { t } from 'svelte-i18n';

  export let reports: UserReportResponse[];
  let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

{#if reports.length}
  <table class="table table-pin-rows max-md:table-xs mb-5">
    <thead>
      <tr class="[&>th]:first-letter:uppercase">
        <th>{$t('admin.reason')}</th>
        <th class="max-md:hidden">
          {$t('admin.reporting', { values: { item: $t('common.user') } })}
        </th>
        <th>
          {$t('admin.reported', { values: { item: $t('common.user') } })}
        </th>
        <th class="max-md:hidden">Chat</th>
        <th>
          {$t('common.message', { values: { count: 1 } })}
        </th>
        <th class="max-md:hidden">{$t('admin.sentAt')}</th>
        <th class="max-sm:hidden">{$t('admin.action')}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each reports as report}
        <ReportRow showAvatar={innerWidth > 1024} on:openModal bind:report />
      {/each}
    </tbody>
  </table>
{:else}
  <div class="grid w-full h-full place-items-center">
    <h2 class="text-xl font-bold first-letter:uppercase">{$t('admin.nothingNew')}</h2>
  </div>
{/if}
