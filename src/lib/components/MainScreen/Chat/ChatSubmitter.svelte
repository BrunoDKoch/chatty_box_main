<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import { chat, chatId } from '$lib/useActiveChat';
  import { t } from 'svelte-i18n';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  export let loading = true;
  export let replyTo: MessageResponse | undefined = undefined;

  // Message handling
  $: newMessage = '';
  $: submitting = false;
  let messageError = false;
  connection.on('msgError', () => (messageError = true));

  // Typing handling
  $: otherUsers = [] as { userName: string; isTyping: boolean }[];
  $: otherUsersTyping = otherUsers.filter((u) => u.isTyping);
  $: currentUserIsTyping = false;

  let singleChatUserBlocked =
    !$chat.isGroupChat && !!$chat.users.find((u) => u.isBlocked || u.isBlocking);
  let messageComposer: HTMLInputElement;
  $: disabled = loading || submitting || singleChatUserBlocked;

  $: {
    if (!loading && messageComposer) {
      messageComposer.focus({ preventScroll: true });
      messageComposer.disabled = false;
    } else if (loading && messageComposer) {
      messageComposer.disabled = true;
    }
  }
  connection.on('typing', (data: { from: string; isTyping: boolean; chatId: string }) => {
    if (data.chatId !== $chatId) return;
    const { from: userName, isTyping } = data;
    if (otherUsers.find((u) => u.userName === userName)) {
      otherUsers.find((u) => u.userName === userName)!.isTyping = isTyping;
    } else {
      otherUsers.push({ userName, isTyping });
    }
    otherUsers = otherUsers;
  });

  // Because there's no other way to know if one should use "e" or "y0000000000000000"
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
  // Message logic
  async function sendMessage() {
    // Checking for 'messageFlagged' because that's how messages flagged by admins are returned
    if (!newMessage || newMessage === 'messageFlagged') return;
    submitting = true;
    await connection.invoke('StopTyping', $chat.id);
    await connection.invoke('SendMessage', $chat.id, newMessage, replyTo?.id ?? undefined);
    submitting = false;
    newMessage = '';
    // Input won't focus without the timeout, likely because of the scrolling to the new message
    setTimeout(() => messageComposer.focus({ preventScroll: true }), 100);
  }
</script>

<form
  on:keydown={async () => await handleTyping()}
  on:submit|preventDefault={async () => await sendMessage()}
  class="box-border relative form-control overflow-hidden max-h-fit"
>
  <label class="label justify-between" for="">
    {#if replyTo}
      <span class="label-text first-letter:uppercase">
        {$t('common.replyingTo', { values: { item: replyTo.user.userName } })}
      </span>
      <CloseButton id="cancel-reply" on:close={() => (replyTo = undefined)} />
    {:else}
      <span> &nbsp;&nbsp;&nbsp;&nbsp; </span>
    {/if}
  </label>
  <div class="join px-4">
    <Button id="file-input-toggle" buttonType="button" joinItem additionalClasses="text-2xl">
      <iconify-icon icon="mdi:attachment" />
    </Button>
    <input
      bind:this={messageComposer}
      bind:value={newMessage}
      type="text"
      id="message-composer"
      placeholder={singleChatUserBlocked ? $t('message.cannotCommunicate') : ''}
      class="input join-item {messageError ? 'input-error' : 'input-bordered'} {disabled
        ? 'input-disabled'
        : ''} w-full box-border"
      {disabled}
    />
    <Button id="chat-submit" {disabled} additionalClasses="text-2xl join-item">
      <iconify-icon icon={submitting ? 'svg-spinners:6-dots-scale' : 'mdi:send'} />
    </Button>
  </div>
  <label class="label" for="">
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
