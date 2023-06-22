<script lang="ts">
  import type { ReportUserResponse } from '$lib/types/combinationTypes';
  import { lockUserOut } from '$lib/useAdminFetch';
  import SuspensionRow from './SuspensionRow.svelte';
  import { t } from 'svelte-i18n';

  export let users: ReportUserResponse[];
</script>

{#if users.length}
  <table class="table">
    <thead>
      <tr>
        <th>User</th>
        <th>Suspension</th>
        <th>Reason</th>
        <th />
      </tr>
    </thead>
    {#each users as user}
      <SuspensionRow
        on:removeSuspension={async ({ detail }) => {
          await lockUserOut(detail.id, { lockout: false, lockoutReason: '' });
          users = users.filter((u) => u !== user);
        }}
        {user}
      />
    {/each}
  </table>
{:else}
  <h2 class="text-xl font-bold first-letter:uppercase">{$t('admin.nothingNew')}</h2>
{/if}
