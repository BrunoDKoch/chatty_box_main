<script lang="ts">
  import type { CompleteChat, MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import { date, time } from 'svelte-i18n';
  export let chatId: string;

  let newMessage = '';
  $: otherUserName = '';
  $: otherUserIsTyping = false;
  $: currentUserIsTyping = false;

  $: userNamesJoined = $chat.users.map((u) => u.userName).join(', ');
  $: messages = $chat.messages;
  connection.on('typing', (data: { from: string; isTyping: boolean }) => {
    otherUserIsTyping = data.isTyping;
    otherUserName = data.from;
  });
  connection.on('chat', (data: CompleteChat) => chat.set(data));

  connection.on('newMessage', (data: MessageResponse) => {
    messages.push(data);
  });

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
    await connection.invoke<'saved' | 'msgError'>('SendMessage', $chat.id, newMessage);
    newMessage = '';
  }
  async function setup() {
    await connection.invoke('GetChat', chatId);
  }
  onMount(async () => await setup());
</script>

{#await $chat}
  <div class="text-9xl w-full h-full items-center justify-center">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{:then data}
  <div class="fixed bg-base-200 w-[75vw]">
    {#if data.chatName}
      <h1>{data.chatName}</h1>
    {:else}
      <h1>{userNamesJoined}</h1>
    {/if}
  </div>

  <div>
    {#if messages.length}
      {#each messages as message}
        <div class="chat {message.isFromCaller ? 'chat-end' : 'chat-start'}">
          <figure class="chat-image avatar">
            <div class="w-10 flex rounded-full">
              {#if message.user.avatar}
                <img src={message.user.avatar} alt="" />
              {:else}
                <p
                  class="justify-self-center h-full w-full pt-2 font-bold text-white text-center place-self-center bg-blue-700"
                >
                  {message.user.userName ? message.user.userName[0] : ''}
                </p>
              {/if}
            </div>
          </figure>
          <div class="chat-header">
            {message.user.userName}
          </div>
          <div class="chat-bubble {message.isFromCaller ? 'chat-bubble-success' : 'chat-bubble-primary'}">{message.message.text}</div>
          <div class="chat-footer opacity-50">
            {$date(new Date(message.message.sentAt))}
            {$time(new Date(message.message.sentAt))}
          </div>
        </div>
      {/each}
    {:else}
      <p>No messages yet</p>
    {/if}
  </div>

  <form
    on:keydown={async () => await handleTyping()}
    on:submit|preventDefault={async () => await sendMessage()}
    class="fixed bottom-0 w-[75vw] box-border form-control overflow-hidden"
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
{/await}
