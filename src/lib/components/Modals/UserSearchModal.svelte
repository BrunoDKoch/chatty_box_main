<script lang="ts">
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import CloseButton from '../Custom/CloseButton.svelte';
  import Modal from './Modal.svelte';
  import UserSearch from '../UserSearch.svelte';
  import { connection } from '$lib/useSignalR';
  import { chatId } from '$lib/useActiveChat';
  import { createEventDispatcher } from 'svelte';
  let selection: UserPartialResponse | null = null;
  const dispatch = createEventDispatcher();
  async function handleSubmit() {
    if (!selection) return;
    await connection.invoke('AddUserToChat', selection.id, $chatId);
    dispatch('close');
  }
</script>

<Modal>
  <CloseButton on:close />
  <div class="grid grid-cols-[1fr_3fr]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center"
      icon="material-symbols:person-add"
      height="5rem"
    />
    <h1 class="font-bold text-2xl first-letter:uppercase">{$t('common.add', {values: {item: 'chatter'}})}</h1>
    {#if !selection}
      <UserSearch bind:selection />
    {:else}
      <div class="grid grid-cols-3">
        <figure>
          <p>{selection.userName ? selection.userName[0] : ''}</p>
        </figure>
        <p class="col-span-2">{selection.userName}</p>
      </div>
    {/if}
  </div>
  <div class="modal-action">
    <div class="btn-group">
      <button class="btn btn-warning" on:click={() => (selection = null)}>
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
