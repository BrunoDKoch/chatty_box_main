<script lang="ts">
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { date, time } from 'svelte-i18n';
  import MessageComponent from '../MainScreen/Chat/MessageComponent.svelte';
  import ReportUserComponent from './ReportUserComponent.svelte';
  import Button from '../Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { UiType } from '$lib/types/daisyUiTypes';

  export let report: UserReportResponse;
  const dispatch = createEventDispatcher();
  let { buttonUIType, text } = getButton();
  function getButton(): { buttonUIType: UiType; text: string } {
    if (report.violationFound === null)
      return {
        buttonUIType: 'info',
        text: 'Check',
      };

    if (!report.violationFound)
      return {
        buttonUIType: 'neutral',
        text: 'No violation (review)',
      };
    if (!report.adminAction)
      return {
        buttonUIType: 'error',
        text: 'Violation found, action pending',
      };
    return {
      buttonUIType: 'neutral',
      text: `Action: ${report.adminAction}`,
    };
  }
</script>

<tr>
  <td>{report.reportReason}</td>
  <td>{report.reportingUser.userName}</td>
  <td>
    <ReportUserComponent user={report.reportedUser} />
  </td>
  <td>{report.chat.chatName ?? report.chat.users.map((u) => u.userName).join(', ')}</td>
  <td>
    <MessageComponent message={report.message} hideOptions displayOnly />
  </td>
  <td>{$date(new Date(report.sentAt))} - {$time(new Date(report.sentAt))}</td>
  <td>
    <Button bind:buttonUIType on:click={() => dispatch('openModal', report)}>{text}</Button>
  </td>
</tr>
