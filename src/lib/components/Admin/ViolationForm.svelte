<script lang="ts">
  import Select from '../Custom/Select.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import Checkbox from '../Custom/Checkbox.svelte';
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import type { ReportOption } from '$lib/types/otherTypes';
  import Button from '../Custom/Button.svelte';

  export let options: { name: string; value: string | number }[];
  export let violatedRule: ReportOption;
  export let reason: string;

  // Handle suspension
  let suspendUser = false;
  let permanentSuspension = false;
  let suspensionExpiry = new Date();

  const dispatch = createEventDispatcher();
</script>

<form
  on:submit|preventDefault={() =>
    dispatch('submit', { violationFound: true, permanentSuspension, suspensionExpiry })}
  action=""
  method="post"
>
  <Select
    {options}
    bind:value={violatedRule}
    labelText="What rules were violated?"
    name="violation"
  />
  {#if violatedRule === 'report.other'}
    <TextInput
      bind:value={reason}
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
  <Button>{$t('common.submit')}</Button>
</form>
