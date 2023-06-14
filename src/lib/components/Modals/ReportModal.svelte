<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import MessageComponent from '../MainScreen/Chat/MessageComponent.svelte';
  import TitleAndIcon from './Titles/TitleAndIcon.svelte';
  import Select from '../Custom/Select.svelte';
  import { reportOptions, type ReportOption } from '$lib/types/otherTypes';
  import Button from '../Custom/Button.svelte';
  import { connection } from '$lib/useSignalR';
  export let message: MessageResponse;
  const options = reportOptions.map((o) => {
    return {
      name: $t(o),
      value: o,
    };
  });
  $: value = '' as ReportOption | '';
  async function handleSubmit() {
    await connection.invoke('ReportUser', {
      reportedUserId: message.user.id,
      messageId: message.id,
      chatId: message.chatId,
      reportReason: value,
    });
  }
</script>

<Modal on:close>
  <TitleAndIcon
    title={$t('report.report', {
      values: { item: $t('common.message', { values: { count: 1 } }) },
    })}
    icon="mdi:exclamation"
  />
  <form on:submit|preventDefault={async () => await handleSubmit()} action="">
    <div class="modal-middle">
      <MessageComponent {message} focusOn={false} hideOptions />
      <Select
        name="reportOptions"
        labelText="Why are you reporting this message?"
        bind:value
        {options}
      />
    </div>
    <div class="modal-action">
      <Button>{$t('common.submit')}</Button>
    </div>
  </form>
</Modal>
