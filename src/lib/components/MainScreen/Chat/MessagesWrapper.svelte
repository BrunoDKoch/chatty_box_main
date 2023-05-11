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
</script>

<div class="overflow-y-auto overflow-x-hidden max-h-[82vh] box-border mt-[4.6rem]">
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
    <p>{$t('common.message', { values: { count: 0 } })}</p>
  {/if}
</div>
