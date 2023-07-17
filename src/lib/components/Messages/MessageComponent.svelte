<script lang="ts">
  import UserAvatar from '$lib/components/UserAvatar.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { chat } from '$lib/useActiveChat';
  import { connection, previews } from '$lib/useSignalR';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import MessageRepliedTo from './MessageRepliedTo.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import MessageBottomInfo from './MessageSubComponents/MessageBottomInfo.svelte';
  import MessageBubble from './MessageSubComponents/MessageBubble.svelte';
  import MessageEdit from './MessageSubComponents/MessageEdit.svelte';
  import { quintIn } from 'svelte/easing';
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
  let bottomElement: HTMLElement;
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
      setTimeout(() => bottomElement.scrollIntoView(scrollOptions), 75);
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
  class="relative box-border"
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
        in:fly={{
          x: message.isFromCaller ? 1000 : -1000,
          duration: animate ? 400 : 0,
        }}
        out:fade={{ duration: 0 }}
        class="chat px-4 {message.isFromCaller ? 'chat-end' : 'chat-start'} {beingSent
          ? 'opacity-70'
          : 'opacity-100'}"
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
          <MessageEdit
            bind:text={message.text}
            on:handleEditSubmission={async () => await handleEditSubmission()}
          />
        {:else}
          <MessageBubble
            on:fileClick
            on:showImage
            on:showExternalLink
            bind:msgError
            isFromCaller={message.isFromCaller}
            text={message.text}
          />
        {/if}
        <div class="chat-footer flex gap-1 opacity-50" bind:this={bottomElement}>
          {#if !hideBottomInfo && !displayOnly}
            <MessageBottomInfo bind:message on:showReadByModal />
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
