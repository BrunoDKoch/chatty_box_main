<script lang="ts">
  import type { ReportUserResponse } from '$lib/types/combinationTypes';
  import { date, t } from 'svelte-i18n';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';

  export let user: ReportUserResponse;
  console.log(user)
</script>

<div class="collapse collapse-arrow">
  <input type="checkbox" class="peer" />
  <div class="collapse-title">
    <UserAvatarAndName {user} size="half" disableModal />
  </div>
  <div class="collapse-content">
    {#if user.pastViolations && user.pastViolations.length}
      {#each user.pastViolations as violation}
        <p>{$t(violation.reportReason)} - {$date(new Date(`${violation.sentAt}Z`))}</p>
      {/each}
    {:else}
      <p>No violations on record</p>
    {/if}
  </div>
</div>
