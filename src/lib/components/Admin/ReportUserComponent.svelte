<script lang="ts">
  import type { ReportUserResponse } from '$lib/types/combinationTypes';
  import { date, t } from 'svelte-i18n';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';

  export let user: ReportUserResponse;
  export let showAvatar: boolean;
  console.log(user);
</script>

<div class="collapse max-w-fit collapse-arrow">
  <input type="checkbox" class="peer" />
  <div class="collapse-title">
    {#if showAvatar}
      <UserAvatarAndName {user} size="half" disableModal />
    {:else}
      <h2>{user.userName}</h2>
    {/if}
  </div>
  <div class="collapse-content max-w-fit">
    {#if user.pastViolations && user.pastViolations.length}
      {#each user.pastViolations as violation}
        <p>{$t(violation.reportReason)} - {$date(new Date(`${violation.sentAt}Z`))}</p>
      {/each}
    {:else}
      <p>No violations on record</p>
    {/if}
  </div>
</div>
