<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import type { Chat, Message, User } from '@prisma/client';

  export let chat: Chat & { users: User[] };
  let messages: { message: Message; user: User; isFromCaller: boolean }[] = [];
  connection.on('chatMessages', (data: typeof messages) => {
    for (const msg of data) {
      if (messages.includes(msg)) continue;
      messages.push(msg);
    }
  });
  const userNamesJoined = chat.users.map((u) => u.userName).join(', ');
</script>

<div class="absolute">
  {#if chat.chatName}
    <h1>{chat.chatName}</h1>
  {:else}
    <h1>{userNamesJoined}</h1>
  {/if}
</div>

<div>
  {#each messages as message}
    <div class="chat {message.isFromCaller ? 'chat-end' : 'chat-start'}">
      <figure class="chat-image avatar">
        <div class="w-10 rounded-full">
          <img src={message.user.avatar} alt="" />
        </div>
      </figure>
      <div class="chat-header">
        {message.user.userName}
      </div>
      <div class="chat-bubble">{message.message.text}</div>
      <div class="chat-footer opacity-50">{message.message.sentAt}</div>
    </div>
  {/each}
</div>
