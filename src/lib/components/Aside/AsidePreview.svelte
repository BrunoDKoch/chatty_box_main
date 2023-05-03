<script lang="ts">
  import type { ChatPreview } from '$lib/types/partialTypes';
  import { date, time } from 'svelte-i18n';
  import { chatId } from '$lib/useActiveChat';
  import useActiveScreen from '$lib/useActiveScreen';
  import { scale } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import UserAvatarAndName from '../UserAvatarAndName.svelte';
  export let chat: ChatPreview;
</script>

<div
  class="hover:bg-gray-300 hover:dark:bg-gray-700 cursor-pointer pl-2"
  on:keydown={() => {
    $chatId = chat.id;
    $useActiveScreen = 'chat';
  }}
  on:click={() => {
    $chatId = chat.id;
    $useActiveScreen = 'chat';
  }}
>
  <p>{chat.chatName ?? chat.users.map((u) => u.userName).join(', ')}</p>
  <div class="grid grid-cols-8 gap-2 indicator">
    {#if chat.lastMessage && !chat.lastMessage.read}
      <span
        transition:scale={{ start: 0, easing: quintInOut }}
        class="indicator-item badge badge-warning">!</span
      >
    {/if}
    {#if chat.lastMessage}
      <UserAvatarAndName user={chat.lastMessage.from} size={25} />
      <div class=" col-span-4">
        <p>{chat.lastMessage.text.slice(0, 140)}</p>
      </div>
      <p class="col-span-full">
        {$date(new Date(`${chat.lastMessage.sentAt}z`), { format: 'medium' })} - {$time(
          new Date(`${chat.lastMessage.sentAt}z`),
        )}
      </p>
    {:else}
      <p>No messages yet</p>
    {/if}
  </div>
</div>
