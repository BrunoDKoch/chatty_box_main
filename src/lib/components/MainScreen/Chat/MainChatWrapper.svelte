<script lang="ts">
  import ReportModal from '$lib/components/Modals/ReportModal.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat, activeChatId } from '$lib/useActiveChat';
  import ChatSubmitter from './ChatSubmitter.svelte';
  import MessagesWrapper from '$lib/components/Messages/MessagesWrapper.svelte';
  import DragNDropWrapper from '$lib/components/Custom/DragNDropWrapper.svelte';
  export let loading: boolean;
  export let searchResults: { messages: MessageResponse[]; messageCount: number };

  let reportingMessage: MessageResponse;
  $: showReportingModal = false;
  $: showLoadingSpinner = false;

  $: loading,
    setTimeout(() => {
      if (!loading) return;
      showLoadingSpinner = true;
    }, 1000);

  let uploading = false;
  let uploadSuccessful = false;

  // Used to dynamically change layout
  // In mobile, the main chat should be hidden if search results are open
  $: searchResultsAreOpen = searchResults.messages && !!searchResults.messages.length;
  $: replyTo = undefined as MessageResponse | undefined;
</script>

<DragNDropWrapper
  wrapperClass="overflow-hidden lg:w-[75dvw] h-[90dvh] max-lg:h-[85dvh] {searchResultsAreOpen
    ? 'max-lg:hidden lg:col-span-2'
    : 'col-span-1'}"
  bind:uploading
  bind:uploadSuccessful
>
    <div
      class="grid grid-cols-1 grid-rows-6 w-full lg:w-[75dvw] overflow-hidden h-[90dvh] max-h-[90dvh] max-lg:h-[85dvh] max-lg:max-h-[85dvh]"
    >
      <div class="row-span-5 min-h-[88dvh] lg:w-[75dvw] max-lg:min-h-[80dvh] overflow-hidden">
        <MessagesWrapper
          on:delete
          on:showImage
          on:showExternalLink
          on:fileClick
          on:showReadByModal
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

</DragNDropWrapper>

{#if showReportingModal}
  <ReportModal
    on:close={() => (showReportingModal = !showReportingModal)}
    message={reportingMessage}
  />
{/if}
