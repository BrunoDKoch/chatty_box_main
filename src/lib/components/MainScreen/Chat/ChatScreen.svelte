<script lang="ts">
  import type { CompleteChat, MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import MessageComponent from './MessageComponent.svelte';
  export let chatId: string;

  let newMessage = '';
  $: otherUserName = '';
  $: otherUserIsTyping = false;
  $: currentUserIsTyping = false;

  $: userNamesJoined = $chat.users.map((u) => u.userName).join(', ');
  connection.on('typing', (data: { from: string; isTyping: boolean }) => {
    otherUserIsTyping = data.isTyping;
    otherUserName = data.from;
  });
  connection.on('chat', (data: CompleteChat) => chat.set(data));

  connection.on('newMessage', (data: MessageResponse) => {
    $chat.messages.push(data);
    $chat.messages = $chat.messages;
    $chat = $chat;
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
    await connection.invoke<'saved' | 'msgError'>('SendMessage', $chat.id, newMessage, undefined);
    newMessage = '';
  }
  async function setup() {
    await connection.invoke('GetChat', chatId);
  }
  onMount(async () => await setup());
</script>

{#if $chat && $chat.id === chatId}
  <div class="fixed bg-base-200 w-[75vw] z-30">
    {#if $chat.chatName}
      <h1>{$chat.chatName}</h1>
    {:else}
      <h1>{userNamesJoined}</h1>
    {/if}
  </div>
  <div class="my-10 overflow-y-auto overflow-x-hidden max-h-[89vh]">
    {#if $chat.messages.length}
      {#each $chat.messages as message}
        <MessageComponent
          bind:message
          focusOn={$chat.messages.indexOf(message) === $chat.messages.length - 1}
        />
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
{:else}
  <div class="text-9xl flex w-full h-full items-center justify-center">
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  </div>
{/if}

