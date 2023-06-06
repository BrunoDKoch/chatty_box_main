<script lang="ts">
  import type { ChatPreview } from '$lib/types/partialTypes';
  import { date, t, time } from 'svelte-i18n';
  import { chatId } from '$lib/useActiveChat';
  import useActiveScreen from '$lib/useActiveScreen';
  import { scale } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import UserAvatar from '../UserAvatar.svelte';
  import { hostedImagesRegex, urlRegex } from '$lib/useLinkCheck';
  export let chat: ChatPreview;
</script>

<a
  href="/"
  class="hover:bg-gray-300 hover:dark:bg-gray-700 {$chatId === chat.id
    ? 'bg-gray-400 dark:bg-gray-600'
    : ''} cursor-pointer pl-2 indicator w-full"
  on:click|preventDefault={() => {
    $chatId = chat.id;
    $useActiveScreen = 'chat';
  }}
>
  {#if chat.lastMessage && !chat.lastMessage.read}
    <span
      transition:scale={{ start: 0, easing: quintInOut }}
      class="indicator-item indicator-middle right-5 badge badge-warning">!</span
    >
  {/if}
  <div class="flex flex-col gap-2">
    <p class="font-semibold">{chat.chatName ?? chat.users.map((u) => u.userName).join(', ')}</p>
    {#if chat.lastMessage}
      <div class="grid grid-cols-8 w-80">
        <div class="col-span-1">
          <UserAvatar user={chat.lastMessage.from} size={25} />
        </div>
        <div class="col-span-7">
          {#if chat.lastMessage.text.match(urlRegex)}
            <div class="flex items-center gap-2">
              <iconify-icon icon="mdi:link" />
              <p>Link</p>
            </div>
          {:else if chat.lastMessage.text.match(hostedImagesRegex)}
            <div class="flex items-center gap-2">
              <iconify-icon icon="mdi:image" />
              <p class="capitalize">{$t('common.image')}</p>
            </div>
          {:else}
            <p>
              {chat.lastMessage.text.length <= 30
                ? chat.lastMessage.text
                : chat.lastMessage.text.slice(0, 30) + '...'}
            </p>
          {/if}
        </div>
      </div>
      <time class="col-span-full">
        {$date(new Date(`${chat.lastMessage.sentAt}Z`), { format: 'medium' })} - {$time(
          new Date(`${chat.lastMessage.sentAt}Z`),
        )}
      </time>
    {:else}
      <p class="first-letter:capitalize">{$t('common.message', { values: { count: 0 } })}</p>
    {/if}
  </div>
</a>
