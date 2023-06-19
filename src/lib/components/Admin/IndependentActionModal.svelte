<script lang="ts">
  import Modal from '../Modals/Modal.svelte';
  import UserSearch from '../UserSearch.svelte';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import ViolationForm from './ViolationForm.svelte';
  import { reportOptions, type ReportOption } from '$lib/types/otherTypes';
  import { t } from 'svelte-i18n';
  import { lockUserOut } from '$lib/useAdminFetch';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let selection: UserPartialResponse | null = null;
  // Get rule value
  let violatedRule = '' as ReportOption;

  let otherViolation = '';
  // Map options
  const options = reportOptions.map((o) => {
    return {
      name: $t(o),
      value: o,
    };
  });
  async function handleSubmit(data: { permanentSuspension: boolean; suspensionExpiry: Date }) {
    if (!selection) return;
    const { permanentSuspension: permanent, suspensionExpiry: lockoutEnd } = data;
    await lockUserOut(selection.id, {
      permanent,
      lockoutEnd,
      lockout: true,
      lockoutReason: violatedRule === 'report.other' ? otherViolation : violatedRule,
    });
    dispatch('close');
  }
</script>

<Modal on:close>
  <div class="modal-top">
    {#if !selection}
      <UserSearch bind:selection />
    {:else}
      <UserAvatarAndName user={selection} size="half" />
    {/if}
  </div>
  <div class="modal-middle">
    <ViolationForm
      on:submit={async ({ detail }) => await handleSubmit(detail)}
      bind:violatedRule
      {options}
      bind:reason={otherViolation}
    />
  </div>
</Modal>
