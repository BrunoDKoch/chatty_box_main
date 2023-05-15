<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import AutoScroller from './AutoScroller.svelte';
  import { date, t } from 'svelte-i18n';
  import MessageComponent from './MessageComponent.svelte';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  export let pagination = false;
  export let total: number;
  export let messages: MessageResponse[];
  export let activePage = 1;
  let hasMore = total > messages.length;
  function isFromPreviousDate(message1: MessageResponse, message2: MessageResponse) {
    return new Date(`${message1.sentAt}z`).getDate() !== new Date(`${message2.sentAt}z`).getDate();
  }
  function checkUserAndTime(message: MessageResponse) {
    if (!messages) return;
    const index = messages.indexOf(message);
    const nextMessage = messages[index + 1];
    if (!nextMessage) return;
    return (
      index !== messages.length - 1 &&
      nextMessage.user.id === message.user.id &&
      new Date(
        new Date(`${nextMessage.sentAt}z`).getTime() - new Date(`${message.sentAt}z`).getTime(),
      ).getMinutes() < 10
    );
  }
</script>

<div class="overflow-y-auto overflow-x-hidden h-[82vh] box-border">
  {#if hasMore && !pagination}
    <AutoScroller skip={messages.length} />
  {/if}
  {#if messages.length}
    {#each messages as message}
      {#if messages.indexOf(message) !== 0 && isFromPreviousDate(message, messages[messages.indexOf(message) - 1])}
        <div class="divider">
          <p class="first-letter:uppercase">
            {$date(new Date(`${message.sentAt}z`), { format: 'full' })}
          </p>
        </div>
      {/if}
      <MessageComponent
        bind:message
        hideBottomInfo={checkUserAndTime(message)}
        focusOn={messages.indexOf(message) === messages.length - 1 && messages.length <= 15}
      />
    {/each}
    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
    {#if pagination && hasMore}
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
