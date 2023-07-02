<script lang="ts">
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import UserSearch from '../UserSearch.svelte';
  import { connection } from '$lib/useSignalR';
  import { chatId } from '$lib/useActiveChat';
  import { createEventDispatcher } from 'svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import Button from '../Custom/Button.svelte';
  let selection: UserPartialResponse | null = null;
  const dispatch = createEventDispatcher();
  async function handleSubmit() {
    if (!selection) return;
    await connection.invoke('AddUserToChat', selection.id, $chatId);
    dispatch('close');
  }
</script>

<Modal on:close>
  <div class="grid grid-cols-[1fr_3fr]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center"
      icon="material-symbols:person-add"
      height="5rem"
    />
    <h1 class="font-bold text-2xl first-letter:uppercase">
      {$t('common.add', { values: { item: 'chatter' } })}
    </h1>
    {#if !selection}
      <UserSearch chatId={$chatId} bind:selection />
    {:else}
      <UserAvatarAndName user={selection} size="half" />
    {/if}
  </div>
  <div class="modal-action">
    <div class="join">
      <Button id="clear" joinItem buttonUIType="warning" on:click={() => (selection = null)}>
        {$t('common.clear')}
      </Button>
      <Button
        id="joinItem"
        buttonUIType="success"
        disabled={!selection}
        on:click={async () => await handleSubmit()}
      >
        {$t('common.submit')}
      </Button>
    </div>
  </div>
</Modal>
