<script lang="ts">
  import type { MessageResponse, SystemMessagePartial } from '$lib/types/combinationTypes';
  import AutoScroller from '$lib/components/MainScreen/Chat/AutoScroller.svelte';
  import { date, t } from 'svelte-i18n';
  import MessageComponent from './MessageComponent.svelte';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import SystemMessageComponent from './SystemMessageComponent.svelte';
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import { chat, activeChatId } from '$lib/useActiveChat';
  import { onMount } from 'svelte';
  export let pagination = false;
  export let total: number;
  export let messages: MessageResponse[];
  export let systemMessages: SystemMessagePartial[];
  export let activePage = 1;
  export let replyTo: undefined | MessageResponse;
  export let isSearch = false;

  let wrapperElement: HTMLElement;

  $: combinedMessages = [...messages, ...systemMessages];
  $: combinedMessages,
    combinedMessages.sort((a, b) => Number(new Date(getDate(a))) - Number(new Date(getDate(b))));
  let currentMessageCount = combinedMessages?.length ?? 15;

  // For handling focus on fetched messages
  $: oldLength = 0;
  $: hasScrolledDown = false;
  $: focusOn = getIdToFocusOn();
  

  $: combinedMessages, focusOn = getIdToFocusOn();

  const initialMessages = [] as typeof combinedMessages;

  function getDate(message: MessageResponse | SystemMessagePartial) {
    if ('sentAt' in message) return message.sentAt;
    return message.firedAt;
  }
  function isFromPreviousDate(message1: MessageResponse, message2: MessageResponse) {
    if (!message1 || !message2) return;
    return new Date(`${message1.sentAt}Z`).getDate() !== new Date(`${message2.sentAt}Z`).getDate();
  }
  function checkUserAndTime(message: MessageResponse) {
    if (!messages) return;
    const index = messages.indexOf(message);
    const nextMessage = messages[index + 1];
    if (!nextMessage) return;
    const resultingDate = new Date(
      new Date(`${nextMessage.sentAt}Z`).getTime() - new Date(`${message.sentAt}Z`).getTime(),
    );
    return (
      index !== messages.length - 1 &&
      nextMessage.user.id === message.user.id &&
      resultingDate.getTime() < 10 * 60 * 1000
    );
  }
  function getIdToFocusOn() {
    if (!messages) return;
    const relevantMessage = messages[messages.length - oldLength - 1];
    if (!relevantMessage) return;
    return relevantMessage.id;
  }
  onMount(() => {
    initialMessages.push(...combinedMessages);
    currentMessageCount = combinedMessages.length;
  });
</script>

<div
  bind:this={wrapperElement}
  class="overflow-y-auto lg:max-w-[75dvw] {isSearch
    ? 'lg:border-l-2 col-span-1'
    : ''} overflow-x-hidden max-lg:md:h-[50dvh] h-[80dvh] max-h-[80dvh] box-border"
>
  {#if !pagination}
    <AutoScroller
      on:fetching={() => {
        oldLength = messages.length;
      }}
      bind:hasMore={$chat.hasMore}
      skip={messages.length}
    />
  {:else if isSearch}
    <div class="fixed right-0 z-50">
      <CloseButton id="search-close" on:close />
    </div>
  {/if}
  {#if combinedMessages.length && initialMessages.length}
    {#each combinedMessages as message (message.id)}
      {#if 'sentAt' in message}
        {#if combinedMessages.indexOf(message) !== 0 && isFromPreviousDate(message, messages[messages.indexOf(message) - 1])}
          <div class="divider">
            <time class="first-letter:uppercase">
              {$date(new Date(`${message.sentAt}Z`), { format: 'full' })}
            </time>
          </div>
        {/if}
        <MessageComponent
          on:replyTo={({ detail }) => (replyTo = detail)}
          on:delete
          on:report
          on:showImage
          on:showExternalLink
          on:fileClick
          on:showReadByModal
          bind:message
          animate={!initialMessages.includes(message)}
          hideBottomInfo={checkUserAndTime(message)}
          focusOn={message.id === focusOn}
        />
      {:else}
        <SystemMessageComponent {message} />
      {/if}
    {/each}
    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
    {#if pagination && $chat.hasMore}
      <div class="flex items-center justify-center">
        <Pagination itemsPerPage={15} {total} bind:activePage />
      </div>
    {/if}
  {:else}
    <div class="grid h-full place-items-center">
      <p class="first-letter:capitalize text-2xl font-semibold">
        {$t('common.message', { values: { count: 0 } })}
      </p>
    </div>
  {/if}
</div>
