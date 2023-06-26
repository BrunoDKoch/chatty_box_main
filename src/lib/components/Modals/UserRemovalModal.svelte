<script lang="ts">
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import { connection } from '$lib/useSignalR';
  import { chat, chatId } from '$lib/useActiveChat';
  import { createEventDispatcher } from 'svelte';
  import Select from '../Custom/Select.svelte';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import Button from '../Custom/Button.svelte';
  let selection = '';
  let showConfirmationModal = false;
  const dispatch = createEventDispatcher();
  let options = $chat.users.map((u) => {
    return {
      name: u.userName,
      value: u.id,
    };
  });
  async function handleSubmit() {
    if (!selection) return;
    await connection.invoke('RemoveUserFromChat', selection, $chatId);
    dispatch('close');
  }
</script>

<Modal on:close>
  <div class="grid grid-cols-[1fr_3fr]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center"
      icon="material-symbols:person-remove"
      height="5rem"
    />
    <h1 class="font-bold text-2xl first-letter:uppercase">
      {$t('common.remove', { values: { item: 'chatter' } })}
    </h1>
    <Select name="chatter" labelText="Chatter" {options} bind:value={selection} />
  </div>
  <div class="modal-action">
    <div class="join">
      <Button id="clear" buttonUIType="warning" joinItem on:click={() => (selection = '')}>
        {$t('common.clear')}
      </Button>
      <Button
        id="submit"
        joinItem
        buttonUIType="error"
        disabled={!selection}
        on:click={() => (showConfirmationModal = !showConfirmationModal)}
      >
        {$t('common.submit')}
      </Button>
    </div>
  </div>
</Modal>

{#if showConfirmationModal}
  <ConfirmationModal
    action={$t('common.remove', {
      values: { item: options.find((u) => u.value === selection)?.name },
    })}
    on:confirm={async () => await handleSubmit()}
    on:deny={() => dispatch('close')}
  />
{/if}
