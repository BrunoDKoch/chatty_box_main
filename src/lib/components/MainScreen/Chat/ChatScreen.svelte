<script lang="ts">
  import type { CompleteChat, MessageResponse } from '$lib/types/combinationTypes';
  import { chat, chatId } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import MessageComponent from './MessageComponent.svelte';
  import AutoScroller from './AutoScroller.svelte';
  import { date, t } from 'svelte-i18n';

  let loading = true;
  let hasFetched = false;
  $: hasMore = false;
  $: $chatId, (loading = $chat.id !== $chatId);

  let newMessage = '';
  $: otherUserName = '';
  $: otherUserIsTyping = false;
  $: currentUserIsTyping = false;

  $: userNamesJoined = $chat.users.map((u) => u.userName).join(', ');
  connection.on('typing', (data: { from: string; isTyping: boolean }) => {
    otherUserIsTyping = data.isTyping;
    otherUserName = data.from;
  });
  connection.on('chat', (data: CompleteChat) => {
    // If chat isn't loaded, fetch full data. Else, grab messages
    if (!$chat.messages || !$chat.messages.length) chat.set(data);
    else if ($chat.id !== data.id) {
      console.log(data)
      $chatId = data.id;
      chat.set(data);
    }
    else {
      $chat.messages.push(...data.messages);
      $chat.messages = $chat.messages;
      $chat = $chat;
      hasFetched = true;
    }

    if ($chat.messageCount > $chat.messages.length) hasMore = true;
    else hasMore = false;

    // Sort messages properly
    $chat.messages = $chat.messages.sort(
      (a, b) => Number(new Date(a.sentAt)) - Number(new Date(b.sentAt)),
    );
    $chat.messages = $chat.messages;
    $chat = $chat;
  });

  connection.on('newMessage', (data: MessageResponse) => {
    $chat.messages.push(data);
    $chat.messages = $chat.messages;
    $chat = $chat;
  });
  function isFromPreviousDate(message1: MessageResponse, message2: MessageResponse) {
    return new Date(`${message1.sentAt}z`).getDate() !== new Date(`${message2.sentAt}z`).getDate();
  }
  async function compareInput() {
    const initialInput = newMessage;
    const newInput = newMessage;
    if (initialInput !== newInput) return;
    currentUserIsTyping = false;
    await connection.invoke('StopTyping', $chat.id);
  }
  async function handleTyping() {
    if (currentUserIsTyping) return;
    currentUserIsTyping = true;
    await connection.invoke('StartTyping', $chat.id);
    setTimeout(async () => await compareInput(), 3000);
  }
  async function sendMessage() {
    await connection.invoke('StopTyping', $chat.id);
    await connection.invoke<'saved' | 'msgError'>('SendMessage', $chat.id, newMessage, undefined);
    newMessage = '';
  }
</script>

{#if loading}
  <div class="w-full h-full flex items-center justify-center text-8xl">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{/if}

{#if $chat && $chat.id === $chatId}
  <div class="fixed bg-base-200 max-md:w-full lg:w-[75vw] z-30">
    {#if $chat.chatName}
      <h1>{$chat.chatName}</h1>
    {:else}
      <h1>{userNamesJoined}</h1>
    {/if}
  </div>
  <div class="my-10 overflow-y-auto overflow-x-hidden max-h-[89vh]">
    {#if hasMore}
      <AutoScroller bind:hasFetched skip={$chat.messages.length} />
    {/if}
    {#if $chat.messages.length}
      {#each $chat.messages as message}
        {#if $chat.messages.indexOf(message) !== 0 && isFromPreviousDate(message, $chat.messages[$chat.messages.indexOf(message) - 1])}
          <div class="divider">
            <p class="first-letter:uppercase">
              {$date(new Date(`${message.sentAt}z`), { format: 'full' })}
            </p>
          </div>
        {/if}
        <MessageComponent
          bind:message
          focusOn={$chat.messages.indexOf(message) === $chat.messages.length - 1 &&
            $chat.messages.length <= 15}
        />
      {/each}
    {:else}
      <p>{$t('common.message', { values: { count: 0 } })}</p>
    {/if}
  </div>

  <form
    on:keydown={async () => await handleTyping()}
    on:submit|preventDefault={async () => await sendMessage()}
    class="fixed bottom-0 max-md:w-full w-[75vw] box-border form-control overflow-hidden"
  >
    <label class="label" for="">
      {#if otherUserIsTyping}
        <span class="label-text">
          {otherUserName} is typing
          <iconify-icon class="align-bottom" icon="svg-spinners:3-dots-scale" />
        </span>
      {/if}
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </label>
    <div class="input-group w-full">
      <input bind:value={newMessage} type="text" class="input input-bordered w-full box-border" />
      <button class="btn text-2xl">
        <iconify-icon icon="mdi:send" />
      </button>
    </div>
  </form>
{:else}
  <div class="text-9xl flex w-full h-full items-center justify-center">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{/if}
