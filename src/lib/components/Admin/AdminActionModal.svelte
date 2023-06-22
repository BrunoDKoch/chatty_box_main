<script lang="ts">
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { reportOptions, type ReportOption } from '$lib/types/otherTypes';
  import { createEventDispatcher } from 'svelte';
  import Select from '../Custom/Select.svelte';
  import MessageComponent from '$lib/components/Messages/MessageComponent.svelte';
  import Modal from '../Modals/Modal.svelte';
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import { slide } from 'svelte/transition';
  import Checkbox from '../Custom/Checkbox.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import Button from '../Custom/Button.svelte';
  import { postAdminAction, reports } from '$lib/useAdminFetch';
  import ViolationForm from './ViolationForm.svelte';
  export let report: UserReportResponse;
  const dispatch = createEventDispatcher();

  // Get rule value
  let violatedRule: ReportOption = reportOptions.includes(report.reportReason as ReportOption)
    ? (report.reportReason as ReportOption)
    : ('report.other' as ReportOption);

  // Map options
  const options = reportOptions.map((o) => {
    return {
      name: $t(o),
      value: o,
    };
  });
  async function handleViolation(violationFound: boolean) {
    await connection.invoke('UpdateReport', report.id, violationFound);
    if (!violationFound) {
      $reports = $reports.filter((r) => r !== report);
      $reports = $reports;
      dispatch('close');
    }
  }
  async function handleLockout(data: {
    permanentSuspension: boolean;
    suspensionExpiry: Date;
    violationFound: boolean;
  }) {
    const { permanentSuspension, suspensionExpiry, violationFound } = data;
    await postAdminAction({
      reportId: report.id,
      violationFound,
      permanentLockout: permanentSuspension,
      lockoutEnd: suspensionExpiry < new Date() ? undefined : suspensionExpiry,
    });
    $reports = $reports.filter((r) => r !== report);
    $reports = $reports;
  }
</script>

<Modal on:close>
  {#if !report.violationFound}
    <div out:slide={{ axis: 'y' }}>
      <MessageComponent message={report.message} displayOnly />
      <form action="">
        <label for="">Does this violate the rules?</label>
        <div class="join">
          <Button on:click={async () => await handleViolation(false)} joinItem buttonUIType="error">
            {$t('common.no')}
          </Button>
          <Button
            on:click={async () => await handleViolation(true)}
            joinItem
            buttonUIType="success"
          >
            {$t('common.yes')}
          </Button>
        </div>
      </form>
    </div>
  {:else if report.violationFound}
    <ViolationForm
      on:submit={async ({ detail }) => await handleLockout(detail)}
      bind:violatedRule
      {options}
      bind:reason={report.reportReason}
    />
    <div class="divider" />
    <div class="join flex items-center justify-center min-w-full">
      <Button
        buttonType="button"
        on:click={async () => await handleViolation(false)}
        buttonUIType="error"
        joinItem
      >
        No violation found
      </Button>
      <Button buttonType="button" buttonUIType="warning" joinItem>
        {$t('common.cancel')}
      </Button>
      <Button buttonType="submit" buttonUIType="success" joinItem>
        {$t('common.proceed')}
      </Button>
    </div>
  {/if}
</Modal>
