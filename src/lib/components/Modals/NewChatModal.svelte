<script lang="ts">
  import type { FriendResponse, UserPartialResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import CloseButton from '../Custom/CloseButton.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import UserSearch from '../UserSearch.svelte';
  import { createEventDispatcher } from 'svelte';
  import { connection, previews } from '$lib/useSignalR';
  import useActiveScreen from '$lib/useActiveScreen';
  import TextInput from '../Custom/TextInput.svelte';
  import Button from '../Custom/Button.svelte';
  const dispatch = createEventDispatcher();
  let selection: UserPartialResponse | null = null;
  let currentlySelectedUsers: UserPartialResponse[] = [];
  $: selection, handleSelection(selection);
  let chatName = '';
  let maxUsers = 99;

  function handleSelection(selection: UserPartialResponse | null) {
    if (!selection) return;
    if (currentlySelectedUsers.includes(selection)) return;
    currentlySelectedUsers.push(selection);
    currentlySelectedUsers = currentlySelectedUsers;
    selection = null;
  }
  async function handleNewChat() {
    await connection.invoke(
      'CreateNewChat',
      currentlySelectedUsers.map((u) => u.id),
      chatName,
      maxUsers,
    );
    $useActiveScreen = 'chat';
    dispatch('close');
  }
</script>

<Modal on:close>
  <div class="min-h-96 flex flex-col gap-3">
    {#each currentlySelectedUsers as user}
      <div class="divider" />
      <div class="flex items-center justify-between">
        <UserAvatarAndName {user} size="half" />
        <Button
          id="remove-chatter"
          buttonUIType="warning"
          on:click={() =>
            (currentlySelectedUsers = currentlySelectedUsers.filter((u) => u !== user))}
        >
          {$t('common.remove', { values: { item: 'chatter' } })}
        </Button>
      </div>
    {/each}
  </div>
  <TextInput required bind:value={chatName} name="chatName" labelText="Chat name" />
  <div class="modal-middle">
    <UserSearch bind:selection />
  </div>
  <div class="modal-action">
    <div class="join">
      <Button id="cancel" joinItem buttonUIType="error" on:click={() => dispatch('close')}>
        {$t('common.cancel')}
      </Button>
      <Button
        id="proceed"
        joinItem
        buttonUIType="success"
        on:click={async () => await handleNewChat()}
      >
        {$t('common.proceed')}
      </Button>
    </div>
  </div>
</Modal>
