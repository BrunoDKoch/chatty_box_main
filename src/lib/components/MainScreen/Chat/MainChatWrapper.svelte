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
  wrapperClass="overflow-hidden h-[90vh] max-lg:h-[85vh] {searchResultsAreOpen
    ? 'max-lg:hidden lg:col-span-2'
    : 'col-span-1'}"
  bind:uploading
  bind:uploadSuccessful
>
  {#if $chat && $chat.id === $chatId}
    <div
      class="grid grid-cols-1 grid-rows-6 w-full relative overflow-hidden  h-[90vh] max-h-[90vh] max-lg:h-[85vh] max-lg:max-h-[85vh]"
    >
      <div class="row-span-5 min-h-[88vh] max-lg:min-h-[85vh] overflow-hidden">
        <MessagesWrapper
          on:delete
          on:showImage
          on:showExternalLink
          on:fileClick
          bind:replyTo
          on:report={({ detail }) => {
            showReportingModal = true;
            reportingMessage = detail;
          }}
          bind:systemMessages={$chat.systemMessages}
          bind:messages={$chat.messages}
          bind:total={$chat.messageCount}
        />
      </div>

      <ChatSubmitter bind:loading bind:replyTo />
    </div>
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
