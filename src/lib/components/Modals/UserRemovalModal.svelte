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
  let selection = '';
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

<Modal>
  <CloseButton on:close />
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
    <div class="btn-group">
      <button class="btn btn-warning" on:click={() => (selection = '')}>
        {$t('common.clear')}
      </button>
      <button
        class="btn btn-success"
        disabled={!selection}
        on:click={async () => await handleSubmit()}
      >
        {$t('common.submit')}
      </button>
    </div>
  </div>
</Modal>
