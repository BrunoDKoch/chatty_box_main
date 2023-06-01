<script lang="ts">
  import AttachmentModal from '$lib/components/Modals/AttachmentModal.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat, chatId } from '$lib/useActiveChat';
  import ChatNameComponent from './ChatNameComponent.svelte';
  import ChatSubmitter from './ChatSubmitter.svelte';
  import MessagesWrapper from './MessagesWrapper.svelte';
  export let loading: boolean;
  export let searchResults: { messages: MessageResponse[]; messageCount: number };
  $: searchResultsAreOpen = searchResults.messages && !!searchResults.messages.length;
  $: replyTo = undefined as MessageResponse | undefined;
  let showAttachmentsModal = false;
</script>

<div class="flex {searchResultsAreOpen ? 'col-span-2' : 'col-span-1'} flex-col max-md:h-[95vh]">
  {#if $chat && $chat.id === $chatId}
    <MessagesWrapper
      bind:replyTo
      bind:hasMore={$chat.hasMore}
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
{/if}
