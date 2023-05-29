<script lang="ts">
  import UserAvatar from '$lib/components/UserAvatar.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection, previews } from '$lib/useSignalR';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { date, t, time } from 'svelte-i18n';
  import MessageLinkPreview from './MessageLinkPreview.svelte';
  import TextInput from '$lib/components/Custom/TextInput.svelte';
  import MessageRepliedTo from './MessageRepliedTo.svelte';
  export let message: MessageResponse;
  export let focusOn: boolean;
  export let hideBottomInfo = false;
  let thisElement: HTMLElement;
  const dispatch = createEventDispatcher();

  // Hover options
  let showOptions = false;
  let messageTranslation = $t('common.message', { values: { count: 1 } });
  let values = { item: messageTranslation };
  const options: { name: string; icon: string; action: () => void }[] = [
    {
      name: $t('common.replyTo', { values }),
      icon: 'mdi:reply',
      action() {
        dispatch('replyTo', message);
      },
    },
  ];

  // Tooltips for read messages
  $: readBy = message.readBy;
  $: readByTooltip = readBy
    .map((r) => {
      if (r.id === message.user.id) return;
      return `${r.userName} ${$t('common.at')} ${$date(
        new Date(`${r.readAt ?? message.sentAt}Z`),
      )} - ${$time(new Date(`${r.readAt ?? message.sentAt}Z`))}`;
    })
    .filter((a) => a)
    .join(', ');

  // Marking messages as read
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (
      entry.isIntersecting &&
      ((message.isFromCaller && !readBy.filter((r) => r.id === message.user.id).length) ||
        readBy.length < $chat.users.length)
    ) {
      await connection.invoke('MarkAsRead', message.id);
      $previews.find((c) => c.id === message.chatId)!.lastMessage!.read = true;
      $previews = $previews;
    }
  });

  // Handling links
  const links = messageContainsLink();
  function messageContainsLink() {
    const urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;
    return message.text.match(urlRegex);
  }

  // Handling editing
  let isEditing = false;
  async function handleEditSubmission() {
    await connection.invoke('EditMessage', message.id, message.text);
    isEditing = false;
  }

  onMount(() => {
    observer.observe(thisElement);
    if (focusOn) thisElement.scrollIntoView({ behavior: 'smooth' });
    if (message.isFromCaller || $chat.userIsAdmin)
      options.push({
        name: $t('common.remove', { values }),
        icon: 'mdi:trash-can',
        action() {
          return;
        },
      });
    if (message.isFromCaller)
      options.push({
        name: $t('common.edit', { values }),
        icon: 'material-symbols:edit',
        action() {
          isEditing = !isEditing;
          console.log(isEditing);
        },
      });
  });
  onDestroy(() => observer.unobserve(thisElement));
</script>

<div
  class="relative hover:bg-base-300"
  id={message.id}
  bind:this={thisElement}
  on:mouseenter={() => (showOptions = !showOptions)}
  on:touchstart={() => (showOptions = !showOptions)}
  on:mouseleave={() => (showOptions = !showOptions)}
>
  {#if showOptions}
    <div class="absolute btn-group {message.isFromCaller ? 'right-14' : 'left-14'} z-50">
      {#each options as option}
        <button on:click={() => option.action()} data-tip={option.name} class="btn tooltip">
          <iconify-icon icon={option.icon} />
        </button>
      {/each}
    </div>
  {/if}
  {#if isEditing}
    <form
      on:submit|preventDefault={async () => await handleEditSubmission()}
      class="input-group"
      action=""
    >
      <input type="text" class="input" name="edit" bind:value={message.text} />
      <button class="btn">
        <iconify-icon icon="mdi:send" />
      </button>
    </form>
  {:else}
    <div>
      {#if message.replyToId}
        <MessageRepliedTo on:scrollTo isFromCaller={message.isFromCaller} replyToId={message.replyToId} />
      {/if}
      <div class="chat px-4 {message.isFromCaller ? 'chat-end' : 'chat-start'}">
        <UserAvatar disableModal={message.isFromCaller} user={message.user} size={50} isChatImage />
        <div class="chat-header">
          {message.user.userName}
        </div>
        <div
          class="chat-bubble {message.isFromCaller ? 'chat-bubble-success' : 'chat-bubble-primary'}"
        >
          {#if links && links.length}
            {#each links as link}
              <MessageLinkPreview {link} />
            {/each}
          {:else}
            {message.text}
          {/if}
        </div>
        {#if !hideBottomInfo}
          <div class="chat-footer flex gap-1 opacity-50">
            <div class="flex-col flex">
              <p class={new Date(message.editedAt).getUTCFullYear() > 1 ? 'line-through' : ''}>
                {$date(new Date(`${message.sentAt}Z`), { format: 'medium' })}
                {$time(new Date(`${message.sentAt}Z`))}
              </p>
              {#if message.editedAt && new Date(message.editedAt).getUTCFullYear() > 1}
                <p>
                  {$date(new Date(`${message.editedAt}Z`), { format: 'medium' })}
                  {$time(new Date(`${message.editedAt}Z`))}
                </p>
              {/if}
            </div>
            {#if message.isFromCaller && message.readBy.length}
              <div
                class="tooltip first-letter:capitalize"
                data-tip="{$t('message.readBy')} {readByTooltip}"
              >
                <iconify-icon
                  icon="mdi:check-all"
                  class={message.readBy.filter((r) => r.id !== message.user.id).length
                    ? 'text-success'
                    : ''}
                />
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
