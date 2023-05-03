<script lang="ts">
  import { scale } from 'svelte/transition';
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import type { User } from '@prisma/client';
  import Modal from './Modal.svelte';
  import CloseButton from './Custom/CloseButton.svelte';
  import type { FriendResponse } from '$lib/types/partialTypes';
  import UserSearch from './UserSearch.svelte';
  const dispatch = createEventDispatcher();

  let selection: FriendResponse | null = null;

  async function handleSubmit() {
    if (!selection) return;
    await connection.invoke('SendFriendRequest', selection.id);
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
    <h1 class="font-bold text-2xl first-letter:uppercase">{$t('friends.add')}</h1>
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
