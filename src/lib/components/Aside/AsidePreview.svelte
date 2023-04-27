<script lang="ts">
  import type { ChatPreview } from '$lib/types/partialTypes';
  import { date, time } from 'svelte-i18n';
  import { chatId } from '$lib/useActiveChat';
  import useActiveScreen from '$lib/useActiveScreen';
  import { scale } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
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
    <figure class="avatar mask mask-squircle w-[25px] h-[25px] col-span-1">
      {#if chat.lastMessage && chat.lastMessage.from.avatar}
        <img src="{PUBLIC_IMAGES_URL}/{chat.lastMessage?.from.avatar}?width=25" alt="" />
      {:else}
        <div
          class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 w-full h-full"
        >
          <p class="font-bold bg-blue-600 dark:bg-blue-800 text-white text-center">
            {chat.lastMessage?.from && chat.lastMessage?.from.userName
              ? chat.lastMessage?.from.userName[0]
              : ''}
          </p>
        </div>
      {/if}
    </figure>
    {#if chat.lastMessage}
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
