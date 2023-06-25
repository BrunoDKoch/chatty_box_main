<script lang="ts">
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import CloseButton from '../Custom/CloseButton.svelte';
  import Modal from './Modal.svelte';
  import UserSearch from '../UserSearch.svelte';
  import { connection } from '$lib/useSignalR';
  import { chat, chatId } from '$lib/useActiveChat';
  import { createEventDispatcher } from 'svelte';
  import Select from '../Custom/Select.svelte';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import Button from '../Custom/Button.svelte';
  export let modalType: 'remove member' | 'add admin';
  let selection = '';
  let showConfirmationModal = false;
  const dispatch = createEventDispatcher();
  let options = $chat.users
    .map((u) => {
      return {
        name: u.userName,
        value: u.id,
      };
    })
    .filter((u) => {
      if (modalType === 'remove member') return u;
      return !$chat.admins.find((a) => a.id === u.value);
    });
  function getTitle() {
    if (modalType === 'remove member') return $t('common.remove', { values: { item: 'chatter' } });
    return $t('common.add', { values: { item: $t('common.admin') } });
  }
  async function handleSubmit() {
    if (!selection) return;
    const action = modalType === 'remove member' ? 'RemoveUserFromChat' : 'AddAdmin';
    await connection.invoke(action, selection, $chatId);
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
      {getTitle()}
    </h1>
    <Select name="chatter" labelText="Chatter" {options} bind:value={selection} />
  </div>
  <div class="modal-action">
    <div class="join">
      <Button
        id="clear-new-member"
        buttonUIType="warning"
        joinItem
        on:click={() => (selection = '')}
      >
        {$t('common.clear')}
      </Button>
      <Button
        id="submit-new-member"
        buttonUIType="success"
        joinItem
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
    action={$t(modalType === 'remove member' ? 'common.remove' : 'common.add', {
      values: { item: options.find((u) => u.value === selection)?.name },
    })}
    on:confirm={async () => await handleSubmit()}
    on:deny={() => dispatch('close')}
  />
{/if}
