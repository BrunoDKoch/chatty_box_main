<script lang="ts">
  import type { ChatPreview, MessagePreview } from '$lib/types/partialTypes';
  import { useShortFormat } from '$lib/useDateFormat';
  import { date, time } from 'svelte-i18n';
  export let chat: ChatPreview;
</script>

<div>
  <p>{chat.chatName ?? chat.users.map((u) => u.userName).join(', ')}</p>
  <figure>
    <div>{chat.lastMessage?.from && chat.lastMessage?.from.userName ? chat.lastMessage?.from.userName[0] : ''}</div>
  </figure>
  {#if chat.lastMessage}
    <div>
      <p>{chat.lastMessage.text.slice(0, 140)}</p>
      <p>{$date(chat.lastMessage.sentAt)} - {$time(chat.lastMessage.sentAt)}</p>
    </div>
    {:else}
    <p>No messages yet</p>
  {/if}
</div>
