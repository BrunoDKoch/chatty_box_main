<script lang="ts">
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { date, t } from 'svelte-i18n';
  import MessageComponent from '$lib/components/Messages/MessageComponent.svelte';
  import ReportUserComponent from './ReportUserComponent.svelte';
  import Button from '../Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';

  export let report: UserReportResponse;
  export let showAvatar: boolean;
  const dispatch = createEventDispatcher();
  let actionResult = getActionText();

  function getActionText(): string {
    if (report.violationFound === null) return $t('admin.pending');

    if (!report.violationFound) return $t('admin.noViolation');

    return report.adminActions.find((a) => !a.revoked)!.action;
  }
</script>

<tr>
  <td>{$t(report.reportReason)}</td>
  <td class="max-md:hidden">{report.reportingUser.userName}</td>
  <td>
    <ReportUserComponent {showAvatar} user={report.reportedUser} />
  </td>
  <td class="max-md:hidden"
    >{report.chat.chatName ?? report.chat.users.map((u) => u.userName).join(', ')}</td
  >
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
  <td class="max-sm:hidden first-letter:uppercase">
    {actionResult}
  </td>
  <td>
    <Button
      id="check-violation-{report.id}"
      buttonType="button"
      buttonUIType="neutral"
      on:click={() => dispatch('openModal', report)}
    >
      {actionResult === $t('admin.noViolation') ? $t('admin.review') : $t('admin.check')}
    </Button>
  </td>
</tr>
