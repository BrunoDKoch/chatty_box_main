<script lang="ts">
  import type { UserReportResponse } from '$lib/types/combinationTypes';
  import { reportOptions, type ReportOption } from '$lib/types/otherTypes';
  import { createEventDispatcher } from 'svelte';
  import Select from '../Custom/Select.svelte';
  import MessageComponent from '../MainScreen/Chat/MessageComponent.svelte';
  import Modal from '../Modals/Modal.svelte';
  import { t } from 'svelte-i18n';
  import { connection } from '$lib/useSignalR';
  import { slide } from 'svelte/transition';
  import Checkbox from '../Custom/Checkbox.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  export let report: UserReportResponse;
  const dispatch = createEventDispatcher();

  // Handle suspension
  let suspendUser = false;
  let permanentSuspension = false;
  let suspensionExpiry = new Date();

  // Get rule value
  $: violatedRule = reportOptions.includes(report.reportReason as ReportOption)
    ? report.reportReason
    : 'report.other';

  // Map options
  const options = reportOptions.map((o) => {
    return {
      name: $t(o),
      value: o,
    };
  });
  async function handleViolation(violationFound: boolean) {
    await connection.invoke('UpdateReport', report.id, violationFound);
    if (!violationFound) dispatch('close');
  }
</script>

<Modal on:close>
  {#if report.violationFound === null}
    <div out:slide={{ axis: 'y' }}>
      <MessageComponent message={report.message} displayOnly />
      <form action="">
        <label for="">Does this violate the rules?</label>
        <div class="join">
          <button
            on:click={async () => await handleViolation(false)}
            class="join-item btn btn-error">{$t('common.no')}</button
          >
          <button
            on:click={async () => await handleViolation(true)}
            class="join-item btn btn-success">{$t('common.yes')}</button
          >
        </div>
      </form>
    </div>
  {:else if report.violationFound}
    <form action="" method="post">
      <Select
        {options}
        bind:value={violatedRule}
        labelText="What rules were violated?"
        name="violation"
      />
      {#if violatedRule === 'report.other'}
        <TextInput
          bind:value={report.reportReason}
          labelText="{$t('common.please')} {$t('common.specify')}"
          name="otherValue"
        />
      {/if}

      <Checkbox labelText="Suspend user?" bind:checked={suspendUser} name="lockout" />
      {#if suspendUser}
        <TextInput
          type="datetime-local"
          labelText="Until when?"
          name="lockoutDate"
          disabled={permanentSuspension}
          bind:value={suspensionExpiry}
        />
        <Checkbox
          name="lockoutPermanent"
          labelText="Suspend permanently?"
          bind:checked={permanentSuspension}
        />
      {/if}
    </form>
  {/if}
</Modal>
