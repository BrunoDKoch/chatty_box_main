<script lang="ts">
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { date, t, time } from 'svelte-i18n';
  import MessageComponent from '$lib/components/Messages/MessageComponent.svelte';
  import ReportUserComponent from './ReportUserComponent.svelte';
  import Button from '../Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { UiType } from '$lib/types/daisyUiTypes';

  export let report: UserReportResponse;
  export let showAvatar: boolean;
  console.log(report);
  const dispatch = createEventDispatcher();
  let actionResult = getActionText();

  function getActionText(): string {
    if (report.violationFound === null || !report.adminActions.length) return 'Pending';

    if (!report.violationFound) return 'No violation found';

    return report.adminActions.find((a) => !a.revoked)!.action;
  }
</script>

<tr>
  <td>{$t(report.reportReason)}</td>
  <td class="max-md:hidden" >{report.reportingUser.userName}</td>
  <td>
    <ReportUserComponent {showAvatar} user={report.reportedUser} />
  </td>
  <td class="max-md:hidden" >{report.chat.chatName ?? report.chat.users.map((u) => u.userName).join(', ')}</td>
  <td>
    {#if showAvatar}
      <MessageComponent message={report.message} hideOptions displayOnly />
      {:else}
      <p>{report.message.text}</p>
    {/if}
  </td>
  <td class="max-md:hidden">
    {$date(new Date(`${report.sentAt}Z`), {
      timeStyle: 'short',
      hour12: false,
      dateStyle: 'medium',
    })}
  </td>
  <td class="max-sm:hidden">
    {actionResult}
  </td>
  <td>
    <Button buttonUIType="neutral" on:click={() => dispatch('openModal', report)}>
      {report.adminActions && report.adminActions.length ? 'Review' : 'Check'}
    </Button>
  </td>
</tr>
