<script lang="ts">
  import UserAvatar from '$lib/components/UserAvatar.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection, previews } from '$lib/useSignalR';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { date, t } from 'svelte-i18n';
  import MessageLinkPreview from './MessageLinkPreview.svelte';
  import MessageRepliedTo from './MessageRepliedTo.svelte';
  import { hostedFilesRegex, urlRegex } from '$lib/useLinkCheck';
  import Button from '$lib/components/Custom/Button.svelte';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  export let message: MessageResponse;
  export let focusOn = false;
  export let hideBottomInfo = false;
  export let hideOptions = false;
  export let displayOnly = false;
  export let animate = false;
  export let scrollOptions: ScrollIntoViewOptions;

  // Handle message being sent
  export let beingSent = false;
  export let msgError = false;

  $: show = false;

  let thisElement: HTMLElement;
  const dispatch = createEventDispatcher();

  // Hover options
  let showOptions = false;
  let messageTranslation = $t('common.message', { values: { count: 1 } });
  let values = {
    item: `${$t('common.the.f', { values: { prepositions: 1 } })} ${messageTranslation}`,
  };
  const options: { name: string; icon: string; action: () => void; id: string }[] = [
    {
      name: $t('common.replyTo', { values }),
      icon: 'mdi:reply',
      action() {
        dispatch('replyTo', message);
      },
      id: 'reply',
    },
  ];

  // Tooltips for read messages
  $: readBy = message.readBy;

  // Marking messages as read
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) return;
    if (readBy.map((r) => r.id).includes($page.data.user.id)) {
      observer.unobserve(entry.target);
      return;
    }
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
      : message.text.match(hostedFilesRegex);
  }
  $: message, (links = messageContainsLink()); // Sadly necessary to avoid the wrong link showing

  // Handling editing
  let isEditing = false;
  async function handleEditSubmission() {
    await connection.invoke('EditMessage', message.id, message.text);
    isEditing = false;
  }

  // Handle touch
  function handleTouchStart() {
    setTimeout(() => {
      showOptions = true;
    }, 100);
  }

  function handleGlobalTouchStart(event: TouchEvent) {
    if (!event.target) return;
    const clickedElement = event.target as HTMLElement;
    if (clickedElement === thisElement || options.map((o) => o.id).includes(clickedElement.id))
      return;
    showOptions = false;
  }

  window.addEventListener('touchstart', handleGlobalTouchStart);

  onMount(() => {
    show = true;
    observer.observe(thisElement);
    if (focusOn) {
      setTimeout(
        () => thisElement.scrollIntoView(scrollOptions),
        10,
      );
      focusOn = false;
    }
    if (message.isFromCaller || $chat.userIsAdmin)
      options.push({
        name: $t('common.remove', { values }),
        icon: 'mdi:trash-can',
        action() {
          dispatch('delete', message);
        },
        id: 'remove',
      });
    if (message.isFromCaller)
      options.push({
        name: $t('common.edit', { values }),
        icon: 'material-symbols:edit',
        action() {
          isEditing = !isEditing;
        },
        id: 'edit',
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
        id: 'report',
      });
  });
  onDestroy(() => observer.unobserve(thisElement));
</script>

<div
  class="relative"
  class:hover:bg-base-300={displayOnly}
  id={message.id}
  role="dialog"
  bind:this={thisElement}
  on:mouseenter={() => (showOptions = !hideOptions && !displayOnly)}
  on:mouseleave={() => (showOptions = false)}
  on:touchstart={handleTouchStart}
>
  {#if showOptions && !hideOptions && !displayOnly && message.text !== 'messageFlagged'}
    <div class="absolute join {message.isFromCaller ? 'right-14' : 'left-14'} z-50">
      {#each options as { action, name, icon, id }}
        <Button {id} on:click={() => action()} tooltip={name} joinItem>
          <iconify-icon {icon} />
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
    {#if show}
      <div
        in:fly={{ x: message.isFromCaller ? 1000 : -1000, duration: animate ? 300 : 0 }}
        out:fade={{ duration: 0 }}
        class="chat transition-all px-4 {message.isFromCaller
          ? 'chat-end'
          : 'chat-start'} {beingSent ? 'opacity-70' : 'opacity-100'}"
      >
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
            <input
              type="text"
              class="input w-full join-item"
              name="edit"
              bind:value={message.text}
            />
            <Button id="send-message" joinItem>
              <iconify-icon icon="mdi:send" />
            </Button>
          </form>
        {:else}
          <div
            class="chat-bubble {message.text === 'messageFlagged'
              ? 'opacity-50 italic'
              : 'opacity-100'} {message.isFromCaller ? 'chat-bubble-success' : 'chat-bubble-info'}
            {msgError ? 'chat-bubble-error' : ''}"
          >
            {#if message.text === 'messageFlagged'}
              {$t(message.text)}
            {:else if links && links.length}
              {#each links as link}
                <MessageLinkPreview on:fileClick on:showImage on:showExternalLink bind:link />
              {/each}
            {:else}
              {message.text}
            {/if}
          </div>
        {/if}
        {#if !hideBottomInfo && !displayOnly}
          <div class="chat-footer flex gap-1 opacity-50">
            <div class="flex-col flex">
              <p class={message.editedAt ? 'line-through' : ''}>
                {$date(new Date(`${message.sentAt}Z`), {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
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
              <button on:click={() => dispatch('showReadByModal', message)}>
                <iconify-icon
                  icon="mdi:check-all"
                  class={message.readBy.filter((r) => r.id !== message.user.id).length
                    ? 'text-success'
                    : ''}
                />
              </button>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
