<script lang="ts">
  import type { FriendResponse, UserPartialResponse } from '$lib/types/partialTypes';
  import { t } from 'svelte-i18n';
  import CloseButton from '../Custom/CloseButton.svelte';
  import Modal from '../Modal.svelte';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  import UserSearch from '../UserSearch.svelte';
  import { createEventDispatcher } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chat, chatId } from '$lib/useActiveChat';
  import type { CompleteChat } from '$lib/types/combinationTypes';
  import TextInput from '../Custom/TextInput.svelte';
  const dispatch = createEventDispatcher();
  let selection: UserPartialResponse | null = null;
  let currentlySelectedUsers: UserPartialResponse[] = [];
  $: selection, handleSelection(selection);
  let chatName = '';
  let maxUsers = 99;

  connection.on('newChat', (data: CompleteChat) => {
    $chat = data;
    $chatId = data.id;
  });

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
  }
</script>

<Modal>
  <CloseButton on:close />
  <div class="min-h-96 flex flex-col gap-3">
    {#each currentlySelectedUsers as user}
      <div class="divider" />
      <div class="flex items-center justify-between">
        <UserAvatarAndName {user} size="half" showName />
        <button
          class="btn btn-warning"
          on:click={() =>
            (currentlySelectedUsers = currentlySelectedUsers.filter((u) => u !== user))}
        >
          {$t('common.remove')}
        </button>
      </div>
    {/each}
  </div>
  <TextInput bind:value={chatName} name="chatName" labelText="Chat name" />
  <div class="modal-middle">
    <UserSearch bind:selection />
  </div>
  <div class="modal-action">
    <div class="btn-group">
      <button on:click={() => dispatch('close')} class="btn btn-error">
        {$t('common.cancel')}
      </button>
      <button on:click={async () => await handleNewChat()} class="btn btn-success">
        {$t('common.proceed')}
      </button>
    </div>
  </div>
</Modal>
