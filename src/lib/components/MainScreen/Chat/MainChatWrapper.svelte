<script lang="ts">
  import ReportModal from '$lib/components/Modals/ReportModal.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat, chatId } from '$lib/useActiveChat';
  import ChatSubmitter from './ChatSubmitter.svelte';
  import MessagesWrapper from '$lib/components/Messages/MessagesWrapper.svelte';
  import DragNDropWrapper from '$lib/components/Custom/DragNDropWrapper.svelte';
  export let loading: boolean;
  export let searchResults: { messages: MessageResponse[]; messageCount: number };

  let reportingMessage: MessageResponse;
  $: showReportingModal = false;

  let uploading = false;
  let uploadSuccessful = false;

  // Used to dynamically change layout
  // In mobile, the main chat should be hidden if search results are open
  $: searchResultsAreOpen = searchResults.messages && !!searchResults.messages.length;
  $: replyTo = undefined as MessageResponse | undefined;
</script>

<DragNDropWrapper
  bind:uploading
  bind:uploadSuccessful
  wrapperClass="flex w-full {searchResultsAreOpen
    ? 'max-lg:hidden lg:col-span-2'
    : 'col-span-1'} flex-col h-[91vh] max-lg:h-[82vh]"
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
    <ChatSubmitter bind:loading bind:replyTo />
  {:else}
    <div class="text-9xl flex w-full h-full items-center justify-center">
      <iconify-icon icon="svg-spinners:6-dots-scale" />
    </div>
  {/if}
</DragNDropWrapper>

{#if showReportingModal}
  <ReportModal
    on:close={() => (showReportingModal = !showReportingModal)}
    message={reportingMessage}
  />
{/if}
