<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import { chat, activeChatId } from '$lib/useActiveChat';
  import { t } from 'svelte-i18n';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import { messageFiles } from '$lib/useMessageFiles';
  import MessageFilesWrapper from '$lib/components/Messages/MessageSubComponents/FileHandling/MessageFilesWrapper.svelte';
  export let loading = true;
  export let replyTo: MessageResponse | undefined = undefined;

  const dispatch = createEventDispatcher();

  // Message handling
  $: newMessage = '';
  let messageError = '';
  $: submitting = false;
  connection.on('msgError', (data: string) => (messageError = data));
  $: {
    if (newMessage.length > 1000) {
      messageError = $t('message.tooLarge');
    }
  }
  $: rows = Math.min(
    Math.max(
      Math.ceil(newMessage.length / 150),
      newMessage.split('').filter((a) => a === '\n').length,
      1,
    ),
    10,
  );
  $: {
    if (messageError === $t('message.empty') && (newMessage.trim() || !newMessage)) {
      messageError = '';
    }
  }

  // Typing handling
  $: otherUsers = [] as { userName: string; isTyping: boolean }[];
  $: otherUsersTyping = otherUsers.filter((u) => u.isTyping);
  $: currentUserIsTyping = false;

  let singleChatUserBlocked =
    !$chat.isGroupChat && !!$chat.users.find((u) => u.isBlocked || u.isBlocking);
  let messageComposer: HTMLTextAreaElement;
  $: disabled = loading || submitting || singleChatUserBlocked;

  $: {
    if (!loading && messageComposer) {
      messageComposer.focus({ preventScroll: true });
      messageComposer.disabled = false;
    } else if (loading && messageComposer) {
      messageComposer.disabled = true;
    }
  }
  connection.on('typing', (data: { from: string; isTyping: boolean; activeChatId: string }) => {
    if (data.chatId !== $activeChatId) return;
    const { from: userName, isTyping } = data;
    if (otherUsers.find((u) => u.userName === userName)) {
      otherUsers.find((u) => u.userName === userName)!.isTyping = isTyping;
    } else {
      otherUsers.push({ userName, isTyping });
    }
    otherUsers = otherUsers;
  });

  // File handling
  $: files = $messageFiles.find((m) => m.chatId === $activeChatId && m.files.length)?.files;

  // Because there's no other way to know if one should use "e" or "y"
  function getSpanishAnd(userName: string) {
    if (
      [
        'a',
        'à',
        'á',
        'ã',
        'e',
        'ê',
        'è',
        'é',
        'ẽ',
        'i',
        'í',
        'ì',
        'o',
        'ò',
        'ó',
        'õ',
        'u',
        'ú',
        'ù',
      ].includes(userName[0])
    )
      return $t('common.and.2');
    return $t('common.and.1');
  }

  // Print out "X is typing", "X and y are typing" or "Multiple users are typing"
  function getTypingMessage(userTyping: { userName: string; isTyping: boolean }) {
    const index = otherUsersTyping.indexOf(userTyping);
    const { length } = otherUsersTyping;
    switch (length - index) {
      case 2:
        return `${userTyping.userName} ${getSpanishAnd(userTyping.userName)} `;
      case 1:
        return userTyping.userName;
      default:
        return `${userTyping.userName}, `;
    }
  }

  // Typing logic
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

  async function handleKeyPress(e: KeyboardEvent) {
    await handleTyping();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  }

  function checkForFilesInMessage() {
    let finalMessage = newMessage;
    if (files && files.length) {
      for (const file of files) {
        finalMessage = `${file}\n${finalMessage}`.trim();
      }
      messageFiles.clearChat($activeChatId);
    }
    return finalMessage.trim();
  }

  // Message logic
  async function sendMessage() {
    if (newMessage.length > 1000) return;

    // Checking for files
    let finalMessage = checkForFilesInMessage();

    if (!finalMessage.trim()) {
      messageError = $t('message.empty');
      return;
    }

    // Checking for 'messageFlagged' because that's how messages flagged by admins are returned
    if (!finalMessage || finalMessage === 'messageFlagged') return;
    dispatch('sendingMessage', finalMessage);
    submitting = true;
    await connection.invoke('StopTyping', $chat.id);

    const success = await connection.invoke(
      'SendMessage',
      $chat.id,
      finalMessage,
      replyTo?.id ?? undefined,
    );
    if (success) {
      newMessage = '';
    }
    submitting = false;
    // Input won't focus without the timeout, likely because of the scrolling to the new message
    setTimeout(() => messageComposer.focus({ preventScroll: true }), 100);
  }
</script>

<form
  on:submit|preventDefault={async () => await sendMessage()}
  class="box-border bg-transparent fixed lg:w-[75dvw] w-full bottom-0 form-control overflow-hidden"
>
  {#if messageError || replyTo}
    <label class="label justify-between" class:bg-base-300={messageError || replyTo} for="">
      {#if messageError}
        <span class="label-text text-error first-letter:uppercase">
          {messageError}
        </span>
      {:else if replyTo}
        <span class="label-text first-letter:uppercase">
          {$t('common.replyingTo', { values: { item: replyTo.user.userName } })}
        </span>
        <CloseButton id="cancel-reply" on:close={() => (replyTo = undefined)} />
      {/if}
    </label>
  {/if}
  {#if files && files.length}
    <MessageFilesWrapper bind:files />
  {/if}
  <div class="box-border bg-base-300 px-4 relative">
    <Button
      id="file-input-toggle"
      buttonType="button"
      format="ghost"
      additionalClasses="text-2xl z-50 absolute bottom-0"
    >
      <iconify-icon icon="mdi:attachment" />
    </Button>
    <textarea
      on:keydown={async (e) => await handleKeyPress(e)}
      bind:this={messageComposer}
      bind:value={newMessage}
      id="message-composer"
      {rows}
      placeholder={singleChatUserBlocked ? $t('message.cannotCommunicate') : ''}
      class="textarea px-12 join-item resize-none {messageError
        ? 'textarea-error'
        : 'textarea-bordered'} {disabled ? 'textarea-disabled' : ''} w-full box-border"
      {disabled}
    />
    <Button
      id="chat-submit"
      format="ghost"
      {disabled}
      additionalClasses="text-2xl absolute right-4 bottom-0"
    >
      <iconify-icon icon={submitting ? 'svg-spinners:6-dots-scale' : 'mdi:send'} />
    </Button>
  </div>
  <label class="label bg-base-300" for="">
    {#if otherUsersTyping.length}
      <span class="label-text">
        {#if otherUsersTyping.length <= 4}
          {#each otherUsersTyping as userTyping}
            {getTypingMessage(userTyping)}
          {/each}
        {:else}
          {$t('common.manyPeople')}
        {/if}
        {$t('common.toBe', { values: { count: otherUsersTyping.length } })}
        {$t('common.typing')}
        <iconify-icon class="align-bottom" icon="svg-spinners:3-dots-scale" />
      </span>
    {:else}
      <span class="label-text">&nbsp;&nbsp;&nbsp;&nbsp;</span>
    {/if}
  </label>
</form>
