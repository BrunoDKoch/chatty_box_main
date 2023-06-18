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
  import Button from '../Custom/Button.svelte';
    import { lockUserOut } from '$lib/useAdminFetch';
  export let report: UserReportResponse;
  const dispatch = createEventDispatcher();

  // Handle suspension
  let suspendUser = false;
  let permanentSuspension = false;
  let suspensionExpiry = new Date();

  // Get rule value
  let violatedRule = reportOptions.includes(report.reportReason as ReportOption)
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
  async function handleLockout() {
    await lockUserOut(report.id, {
      lockout: true,
      lockoutReason: violatedRule,
      lockoutEnd: suspensionExpiry,
      permanent: permanentSuspension,
    })
  }
</script>

<Modal on:close>
  {#if !report.violationFound}
    <div out:slide={{ axis: 'y' }}>
      <MessageComponent message={report.message} displayOnly />
      <form action="">
        <label for="">Does this violate the rules?</label>
        <div class="join">
          <Button
            on:click={async () => await handleViolation(false)}
            joinItem
            buttonUIType="error"
          >
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
    <form on:submit|preventDefault={async() => await handleLockout()} action="" method="post">
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
    </form>
  {/if}
</Modal>
