<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat, activeChatId } from '$lib/useActiveChat';
  import ChatNameComponent from './ChatNameComponent.svelte';
  import MessagesWrapper from '$lib/components/Messages/MessagesWrapper.svelte';
  import MainChatWrapper from './MainChatWrapper.svelte';
  import UserSearchModal from '$lib/components/Modals/UserSearchModal.svelte';
  import ChatNotificationsModal from '$lib/components/Modals/ChatNotificationsModal.svelte';
  import ConfirmationModal from '$lib/components/Modals/ConfirmationModal.svelte';
  import { t } from 'svelte-i18n';
  import useActiveScreen from '$lib/useActiveScreen';
  import { connection, previews } from '$lib/useSignalR';
  import ChatMembersModal from '$lib/components/Modals/ChatMembersModal.svelte';
  import ImageModal from '$lib/components/Modals/ImageModal.svelte';
  import ExternalLinkModal from '$lib/components/Modals/ExternalLinkModal.svelte';
  import FileModal from '$lib/components/Modals/FileModal.svelte';
  import ReadByModal from '$lib/components/Modals/ReadByModal.svelte';

  let loading = $chat.id !== $activeChatId;
  $: $activeChatId, setTimeout(() => (loading = $chat.id !== $activeChatId), 500);
  let searchResults: { messages: MessageResponse[]; messageCount: number } = {
    messages: [],
    messageCount: 0,
  };
  $: activeSearchPage = 1;
  $: messageToDelete = null as MessageResponse | null;
  $: search = '';

  // Modals for added chat functionality
  let showUserSearchModal = false;
  let showUserRemovalModal = false;
  let showConfirmLeaveModal = false;
  let showNotificationsModal = false;
  let showConfirmDeletionModal = false;
  let showAddAdminModal = false;

  // These use string because they require a link
  let showImageModal = '';
  let showExternalLink = '';
  let showFileModal = '';

  // This one uses a message response
  let showReadByModal: MessageResponse | null = null;

  async function handleLeaveChat() {
    await connection.invoke('LeaveChat', $activeChatId);
    $useActiveScreen = 'friends';
    $previews = $previews.filter((p) => p.id !== $activeChatId);
    $previews = $previews;
  }
  async function handleMessageDeletion(message: MessageResponse | null) {
    if (!message) return;
    const deletionResult = await connection.invoke<boolean>(
      'DeleteMessage',
      message.id,
      message.chatId,
    );
    if (deletionResult) {
      await connection.invoke('GetChatPreviews');
      $chat.messages = $chat.messages.filter((m) => m.id !== messageToDelete?.id);
      $chat.messages = $chat.messages;
    }
    messageToDelete = null;
  }
</script>

{#if loading}
  <div class="grid w-full h-full place-items-center text-8xl relative">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{:else}
  <div class="overflow-hidden max-h-screen lg:h-screen fixed">
    <ChatNameComponent
      bind:activeSearchPage
      bind:searchResults
      bind:search
      on:openUserSearchModal={() => (showUserSearchModal = !showUserSearchModal)}
      on:openUserRemovalModal={() => (showUserRemovalModal = !showUserRemovalModal)}
      on:openNotificationsModal={() => (showNotificationsModal = !showNotificationsModal)}
      on:openConfirmLeaveModal={() => (showConfirmLeaveModal = !showConfirmLeaveModal)}
      on:openAddAdminModal={() => (showAddAdminModal = !showAddAdminModal)}
    />
    <div
      class="grid h-[90dvh] max-lg:h-[85dvh] z-[1] relative overflow-hidden {searchResults.messages &&
      searchResults.messages.length
        ? 'lg:grid-cols-3'
        : 'grid-cols-1'}"
    >
      <MainChatWrapper
        on:delete={({ detail }) => {
          messageToDelete = detail;
          showConfirmDeletionModal = !showConfirmDeletionModal;
        }}
        on:showImage={({ detail }) => (showImageModal = detail)}
        on:showExternalLink={({ detail }) => (showExternalLink = detail)}
        on:fileClick={({ detail }) => (showFileModal = detail)}
        on:showReadByModal={({ detail }) => (showReadByModal = detail)}
        bind:searchResults
        bind:loading
      />
      {#if searchResults.messages && searchResults.messages.length}
        <MessagesWrapper
          replyTo={undefined}
          on:close={() => {
            searchResults.messages.length = 0;
            search = '';
          }}
          isSearch
          systemMessages={[]}
          bind:messages={searchResults.messages}
          bind:total={searchResults.messageCount}
          bind:activePage={activeSearchPage}
          pagination
        />
      {/if}
    </div>
  </div>
{/if}

{#if showUserSearchModal}
  <UserSearchModal on:close={() => (showUserSearchModal = !showUserSearchModal)} />
{:else if showUserRemovalModal}
  <ChatMembersModal
    modalType="remove member"
    on:close={() => (showUserRemovalModal = !showUserRemovalModal)}
  />
{:else if showNotificationsModal}
  <ChatNotificationsModal on:close={() => (showNotificationsModal = !showNotificationsModal)} />
{:else if showConfirmLeaveModal}
  <ConfirmationModal
    on:deny={() => (showConfirmLeaveModal = !showConfirmLeaveModal)}
    on:confirm={async () => await handleLeaveChat()}
    action={$t('common.leave', { values: { item: 'chat' } })}
  />
{:else if showConfirmDeletionModal && messageToDelete}
  <ConfirmationModal
    on:deny={() => (showConfirmDeletionModal = !showConfirmDeletionModal)}
    on:confirm={async () => await handleMessageDeletion(messageToDelete)}
    action={$t('common.remove', {
      values: { item: $t('common.message', { values: { count: 1 } }) },
    })}
  />{:else if showAddAdminModal}
  <ChatMembersModal
    modalType="add admin"
    on:close={() => (showAddAdminModal = !showAddAdminModal)}
  />
{:else if showImageModal}
  <ImageModal on:close={() => (showImageModal = '')} link={showImageModal} />
{:else if showExternalLink}
  <ExternalLinkModal on:close={() => (showExternalLink = '')} link={showExternalLink} />
{:else if showFileModal}
  <FileModal link={showFileModal} on:close={() => (showFileModal = '')} />
{:else if showReadByModal}
  <ReadByModal message={showReadByModal} on:close={() => (showReadByModal = null)} />
{/if}
