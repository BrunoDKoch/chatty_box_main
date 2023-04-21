<script lang="ts">
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { onDestroy, onMount } from 'svelte';
  import { date, t, time } from 'svelte-i18n';
  export let message: MessageResponse;
  const { user, isFromCaller } = message;
  let thisElement: HTMLElement;
  $: readBy = message.readBy;
  $: readByTooltip = readBy
    .map((r) => {
      if (r.id === message.user.id) return;
      return `${r.userName} ${$t('common.at')} ${$date(
        new Date(r.readAt ?? message.sentAt),
      )} - ${$time(new Date(r.readAt ?? message.sentAt))}`;
    })
    .filter((a) => a)
    .join(', ');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (
        entry.isIntersecting &&
        ((isFromCaller && !readBy.filter((r) => r.id === user.id).length) ||
          readBy.length < $chat.users.length)
      )
        await connection.invoke('MarkAsRead', message.id);
    });
  });
  onMount(() => observer.observe(thisElement));
  onDestroy(() => observer.disconnect());
</script>

<div bind:this={thisElement} class="chat {isFromCaller ? 'chat-end' : 'chat-start'}">
  <figure class="chat-image avatar">
    <div class="w-10 flex rounded-full">
      {#if user.avatar}
        <img src={user.avatar} alt="" />
      {:else}
        <p
          class="justify-self-center h-full w-full pt-2 font-bold text-white text-center place-self-center bg-blue-700"
        >
          {user.userName ? user.userName[0] : ''}
        </p>
      {/if}
    </div>
  </figure>
  <div class="chat-header">
    {user.userName}
  </div>
  <div class="chat-bubble {isFromCaller ? 'chat-bubble-success' : 'chat-bubble-primary'}">
    {message.text}
  </div>
  <div class="chat-footer opacity-50">
    {$date(new Date(message.sentAt))}
    {$time(new Date(message.sentAt))}
    {#if isFromCaller}
      <div
        class="tooltip first-letter:capitalize"
        data-tip="{$t('message.readBy')} {readByTooltip}"
      >
        <iconify-icon
          icon="mdi:check-all"
          class={message.readBy.filter((r) => r.id !== user.id).length ? 'text-success' : ''}
        />
      </div>
    {/if}
  </div>
</div>
