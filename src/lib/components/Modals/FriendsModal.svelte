<script lang="ts">
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import Modal from './Modal.svelte';
  import type { FriendResponse } from '$lib/types/partialTypes';
  import UserSearch from '../UserSearch.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import Button from '../Custom/Button.svelte';
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
      <Button id="clear" joinItem buttonUIType="warning" on:click={() => (selection = null)}>
        {$t('common.clear')}
      </Button>
      <Button
        id="submit"
        joinItem
        buttonUIType="success"
        disabled={!selection}
        on:click={async () => await handleSubmit()}
      >
        {$t('common.submit')}
      </Button>
    </div>
  </div>
</Modal>
