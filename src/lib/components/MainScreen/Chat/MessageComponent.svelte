<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection, previews } from '$lib/useSignalR';
  import { onDestroy, onMount } from 'svelte';
  import { date, t, time } from 'svelte-i18n';
  export let message: MessageResponse;
  export let focusOn: boolean;
  const { user, isFromCaller } = message;
  let thisElement: HTMLElement;
  $: readBy = message.readBy;
  $: readByTooltip = readBy
    .map((r) => {
      if (r.id === message.user.id) return;
      return `${r.userName} ${$t('common.at')} ${$date(
        new Date(`${r.readAt ?? message.sentAt}z`),
      )} - ${$time(new Date(`${r.readAt ?? message.sentAt}z`))}`;
    })
    .filter((a) => a)
    .join(', ');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (
        entry.isIntersecting &&
        ((isFromCaller && !readBy.filter((r) => r.id === user.id).length) ||
          readBy.length < $chat.users.length)
      ) {
        await connection.invoke('MarkAsRead', message.id);
        $previews.find((c) => c.id === message.chatId)!.lastMessage!.read = true;
        $previews = $previews;
      }
    });
  });
  onMount(() => {
    observer.observe(thisElement);
    if (focusOn) thisElement.scrollIntoView({ behavior: 'smooth' });
  });
  onDestroy(() => observer.disconnect());
</script>

<div bind:this={thisElement} class="chat {isFromCaller ? 'chat-end' : 'chat-start'}">
  <figure class="chat-image avatar w-[50px] h-[50px] mask mask-squircle">
    {#if user.avatar}
      <img src="{PUBLIC_IMAGES_URL}/{user.avatar}?width=50" alt="" />
    {:else}
      <div
        class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 min-w-max min-h-max"
      >
        <p class="text-center pt-2 font-bold text-xl min-w-max min-h-max">
          {user.userName ? user.userName[0] : ''}
        </p>
      </div>
    {/if}
  </figure>
  <div class="chat-header">
    {user.userName}
  </div>
  <div class="chat-bubble {isFromCaller ? 'chat-bubble-success' : 'chat-bubble-primary'}">
    {message.text}
  </div>
  <div class="chat-footer opacity-50">
    {$date(new Date(`${message.sentAt}z`), { format: 'medium' })}
    {$time(new Date(`${message.sentAt}z`))}
    {#if isFromCaller && message.readBy.length}
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
