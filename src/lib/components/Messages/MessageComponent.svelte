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
  import { hostedImagesRegex, urlRegex } from '$lib/useLinkCheck';
  import Button from '$lib/components/Custom/Button.svelte';
  export let message: MessageResponse;
  export let focusOn: boolean = false;
  export let hideBottomInfo = false;
  export let hideOptions = false;
  export let displayOnly = false;
  let thisElement: HTMLElement;
  const dispatch = createEventDispatcher();

  // Hover options
  let showOptions = false;
  let messageTranslation = $t('common.message', { values: { count: 1 } });
  let values = {
    item: `${$t('common.the.f', { values: { prepositions: 1 } })} ${messageTranslation}`,
  };
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
      let baseDate = `${r.readAt ?? message.sentAt}`;
      baseDate = baseDate.endsWith('Z') ? baseDate : baseDate + 'Z';
      return `${r.userName} ${$t('common.at')} ${$date(new Date(baseDate), {
        dateStyle: 'short',
        timeStyle: 'short',
      })}`;
    })
    .filter((a) => a)
    .join(', ');

  // Marking messages as read
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (readBy.length >= $chat.users.length) return;
    if (!entry.isIntersecting) return;
    await connection.invoke('MarkAsRead', message.id);
    previews.update((p) => {
      p = p.map((preview) => {
        if (preview.id !== message.chatId) return preview;
        preview.lastMessage!.read = true;
        return preview;
      });
      return p;
    });
  });

  // Handling links
  $: links = messageContainsLink();
  function messageContainsLink() {
    return message.text.match(urlRegex)?.length
      ? message.text.match(urlRegex)
      : message.text.match(hostedImagesRegex);
  }
  $: message, (links = messageContainsLink()); // Sadly necessary to avoid the wrong link showing

  // Handling editing
  let isEditing = false;
  async function handleEditSubmission() {
    await connection.invoke('EditMessage', message.id, message.text);
    isEditing = false;
  }

  onMount(() => {
    observer.observe(thisElement);
    if (focusOn)
      thisElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    if (message.isFromCaller || $chat.userIsAdmin)
      options.push({
        name: $t('common.remove', { values }),
        icon: 'mdi:trash-can',
        action() {
          dispatch('delete', message);
        },
      });
    if (message.isFromCaller)
      options.push({
        name: $t('common.edit', { values }),
        icon: 'material-symbols:edit',
        action() {
          isEditing = !isEditing;
        },
      });
    if (!message.isFromCaller)
      options.push({
        name: $t('report.report', {
          values: { item: $t('common.message', { values: { count: 1 } }) },
        }),
        icon: 'material-symbols:exclamation',
        action() {
          dispatch('report', message);
        },
      });
  });
  onDestroy(() => observer.unobserve(thisElement));
</script>

<div
  class="relative {displayOnly ? '' : 'hover:bg-base-300'}"
  id={message.id}
  bind:this={thisElement}
  on:mouseenter={() => (showOptions = !showOptions)}
  on:touchstart={() => (showOptions = !showOptions)}
  on:mouseleave={() => (showOptions = !showOptions)}
>
  {#if showOptions && !hideOptions && !displayOnly && message.text !== 'messageFlagged'}
    <div class="absolute join {message.isFromCaller ? 'right-14' : 'left-14'} z-50">
      {#each options as option}
        <Button on:click={() => option.action()} tooltip={option.name} joinItem>
          <iconify-icon icon={option.icon} />
        </Button>
      {/each}
    </div>
  {/if}
  <div>
    {#if message.replyToId}
      <MessageRepliedTo
        on:scrollTo
        isFromCaller={message.isFromCaller}
        replyToId={message.replyToId}
      />
    {/if}
    <div class="chat px-4 {message.isFromCaller ? 'chat-end' : 'chat-start'}">
      <UserAvatar
        disableModal={message.isFromCaller || displayOnly}
        user={message.user}
        size={50}
        isChatImage
      />
      <div class="chat-header">
        {message.user.userName}
      </div>
      {#if isEditing}
        <form
          on:submit|preventDefault={async () => await handleEditSubmission()}
          class="join w-full"
          action=""
        >
          <input type="text" class="input w-full" name="edit" bind:value={message.text} />
          <Button>
            <iconify-icon icon="mdi:send" />
          </Button>
        </form>
      {:else}
        <div
          class="chat-bubble {message.text === 'messageFlagged'
            ? 'opacity-50 italic'
            : 'opacity-100'} {message.isFromCaller ? 'chat-bubble-success' : 'chat-bubble-primary'}"
        >
          {#if message.text === 'messageFlagged'}
            {$t(message.text)}
          {:else if links && links.length}
            {#each links as link}
              <MessageLinkPreview bind:link />
            {/each}
          {:else}
            {message.text}
          {/if}
        </div>
      {/if}
      {#if !hideBottomInfo}
        <div class="chat-footer flex gap-1 opacity-50">
          <div class="flex-col flex">
            <p class={message.editedAt ? 'line-through' : ''}>
              {$date(new Date(`${message.sentAt}Z`), { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
            {#if message.editedAt}
              <time>
                {$date(new Date(`${message.editedAt}Z`), {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
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
</div>
