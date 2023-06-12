<script lang="ts">
  import { scale } from 'svelte/transition';
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import type { User } from '@prisma/client';
  import Modal from './Modal.svelte';
  import CloseButton from '../Custom/CloseButton.svelte';
  import type { FriendResponse } from '$lib/types/partialTypes';
  import UserSearch from '../UserSearch.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  const dispatch = createEventDispatcher();

  let selection: FriendResponse | null = null;

  async function handleSubmit() {
    if (!selection) return;
    await connection.invoke('SendFriendRequest', selection.id);
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
    <h1 class="font-bold text-2xl first-letter:uppercase">{$t('friends.add')}</h1>
    {#if !selection}
      <UserSearch bind:selection />
    {:else}
      <UserAvatarAndName user={selection} size="half" />
    {/if}
  </div>
  <div class="modal-action">
    <div class="join">
      <button class="join-item btn btn-warning" on:click={() => (selection = null)}>
        {$t('common.clear')}
      </button>
      <button
        class="join-item btn btn-success"
        disabled={!selection}
        on:click={async () => await handleSubmit()}
      >
        {$t('common.submit')}
      </button>
    </div>
  </div>
</Modal>
