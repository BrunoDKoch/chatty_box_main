<script lang="ts">
  import AttachmentModal from '$lib/components/Modals/AttachmentModal.svelte';
  import ReportModal from '$lib/components/Modals/ReportModal.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat, chatId } from '$lib/useActiveChat';
  import ChatNameComponent from './ChatNameComponent.svelte';
  import ChatSubmitter from './ChatSubmitter.svelte';
  import MessagesWrapper from '$lib/components/Messages/MessagesWrapper.svelte';
  export let loading: boolean;
  export let searchResults: { messages: MessageResponse[]; messageCount: number };

  let reportingMessage: MessageResponse;
  $: showReportingModal = false;

  // Used to dynamically change layout
  // In mobile, the main chat should be hidden if search results are open
  $: searchResultsAreOpen = searchResults.messages && !!searchResults.messages.length;
  $: replyTo = undefined as MessageResponse | undefined;
  let showAttachmentsModal = false;
</script>

<div
  class="flex {searchResultsAreOpen
    ? 'max-md:hidden lg:col-span-2'
    : 'col-span-1'} flex-col h-[91vh] max-md:h-[82vh]"
>
  {#if $chat && $chat.id === $chatId}
    <MessagesWrapper
      on:delete
      bind:replyTo
      on:report={({ detail }) => {
        showReportingModal = true;
        reportingMessage = detail;
      }}
      bind:systemMessages={$chat.systemMessages}
      bind:messages={$chat.messages}
      bind:total={$chat.messageCount}
    />
    <ChatSubmitter
      on:toggleAttachmentsModal={() => (showAttachmentsModal = !showAttachmentsModal)}
      bind:loading
      bind:replyTo
    />
  {:else}
    <div class="text-9xl flex w-full h-full items-center justify-center">
      <iconify-icon icon="svg-spinners:6-dots-scale" />
    </div>
  {/if}
</div>

{#if showAttachmentsModal}
  <AttachmentModal on:close={() => (showAttachmentsModal = !showAttachmentsModal)} />
{:else if showReportingModal}
  <ReportModal
    on:close={() => (showReportingModal = !showReportingModal)}
    message={reportingMessage}
  />
{/if}
