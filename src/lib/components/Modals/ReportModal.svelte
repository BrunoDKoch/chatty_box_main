<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { locale, t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import MessageComponent from '$lib/components/Messages/MessageComponent.svelte';
  import TitleAndIcon from './Titles/TitleAndIcon.svelte';
  import Select from '../Custom/Select.svelte';
  import { reportOptions, type ReportOption } from '$lib/types/otherTypes';
  import Button from '../Custom/Button.svelte';
  import { connection } from '$lib/useSignalR';
  import useError from '$lib/useError';
  import TextInput from '../Custom/TextInput.svelte';
  export let message: MessageResponse;

  // Handle display
  $: loading = false;
  $: success = false;
  connection.invoke('reportReceived', () => (success = true));

  // Map options
  const options = reportOptions.map((o) => {
    return {
      name: $t(o),
      value: o,
    };
  });

  // Handle value
  $: value = '' as ReportOption | '';
  // If value is "other", we'll send this instead
  $: other = '';
  async function handleSubmit() {
    loading = true;
    try {
      await connection.invoke('ReportUser', {
        reportedUserId: message.user.id,
        messageId: message.id,
        activeChatId: message.chatId,
        reportReason: value === 'report.other' ? other : value,
      });
      success = true;
    } catch (err) {
      $useError = err as App.Error;
    } finally {
      loading = false;
    }
  }
</script>

<Modal on:close>
  <TitleAndIcon
    title={$t(success ? 'report.reported' : 'report.report', {
      values: { item: $t('common.message', { values: { count: 1 } }) },
    })}
    icon={success ? 'mdi:check' : 'mdi:exclamation'}
    textColor={success ? 'success' : 'neutral'}
  />
  {#if success}
    <p class="first-letter:uppercase">{$t('report.reportSent')}</p>
  {:else}
    <form on:submit|preventDefault={async () => await handleSubmit()} action="">
      <div class="modal-middle">
        <MessageComponent {message} focusOn={false} hideOptions />
        <Select
          name="reportOptions"
          labelText="Why are you reporting this message?"
          bind:value
          {options}
        />
        {#if value === 'report.other'}
          <TextInput
            labelText="{$t('common.please')}{$locale === 'en' ? '' : ','} {$t('common.specify')}"
            bind:value={other}
            name="other"
            required
          />
        {/if}
      </div>
      <div class="modal-action">
        <Button id="submit-report" bind:loading>{$t('common.submit')}</Button>
      </div>
    </form>
  {/if}
</Modal>
