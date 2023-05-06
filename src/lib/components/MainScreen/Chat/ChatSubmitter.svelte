<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import { chat, chatId } from '$lib/useActiveChat';
  import { t } from 'svelte-i18n';
  export let loading = true;
  let newMessage = '';
  $: submitting = false;
  let messageError = false;
  $: otherUsers = [] as { userName: string; isTyping: boolean }[];
  $: otherUsersTyping = otherUsers.filter((u) => u.isTyping);
  $: currentUserIsTyping = false;
  let messageComposer: HTMLInputElement;

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
    submitting = true;
    await connection.invoke('StopTyping', $chat.id);
    const result = await connection.invoke<'newMessage' | 'msgError'>(
      'SendMessage',
      $chat.id,
      newMessage,
      undefined,
    );
    submitting = false;
    if (result === 'msgError') {
      messageError = true;
      return;
    }
    newMessage = '';
  }
</script>

<form
  on:keydown={async () => await handleTyping()}
  on:submit|preventDefault={async () => await sendMessage()}
  class="box-border form-control overflow-hidden max-md:pb-10 max-h-fit"
>
  <div class="input-group px-4">
    <input
      bind:this={messageComposer}
      bind:value={newMessage}
      type="text"
      class="input {messageError ? 'input-error' : 'input-bordered'} w-full box-border"
      disabled={loading || submitting}
    />
    <button class="btn text-2xl">
      <iconify-icon icon={submitting ? 'svg-spinners:6-dots-scale' : 'mdi:send'} />
    </button>
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
