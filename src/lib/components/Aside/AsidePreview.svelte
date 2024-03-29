<script lang="ts">
  import type { ChatPreview } from '$lib/types/partialTypes';
  import { date, t } from 'svelte-i18n';
  import { activeChatId } from '$lib/useActiveChat';
  import useActiveScreen from '$lib/useActiveScreen';
  import { scale } from 'svelte/transition';
  import { quintInOut } from 'svelte/easing';
  import UserAvatar from '../UserAvatar.svelte';
  import { hostedFilesRegex, urlRegex } from '$lib/useLinkCheck';
  import AsidePreviewLink from './AsidePreviewLink.svelte';
  import canFetchChat from '$lib/canFetchChat';
  export let chat: ChatPreview;
</script>

<a
  href="/"
  aria-disabled={!$canFetchChat}
  class:disabled={!$canFetchChat}
  class:custom-hover={$canFetchChat}
  class:cursor-pointer={$canFetchChat}
  class:cursor-default={!$canFetchChat}
  class=" {$activeChatId === chat.id ? 'bg-gray-400 dark:bg-gray-600' : ''} pl-2 indicator w-full"
  id={chat.id}
  on:click|preventDefault={() => {
    if (!$canFetchChat) return;
    if ($activeChatId !== chat.id) {
      $activeChatId = chat.id;
      $useActiveScreen = 'chat';
    }
  }}
>
  {#if chat.lastMessage && !chat.lastMessage.read}
    <span
      transition:scale={{ start: 0, easing: quintInOut, duration: 100 }}
      class="indicator-item indicator-middle right-5 badge badge-warning">!</span
    >
  {/if}
  <div class="flex flex-col gap-2">
    <p class="font-semibold">{chat.chatName ?? chat.users.map((u) => u.userName).join(', ')}</p>
    {#if chat.lastMessage}
      <div class="grid grid-cols-8 w-80">
        <div class="col-span-1">
          <UserAvatar
            lowerOpacity={!$canFetchChat}
            disableModal
            user={chat.lastMessage.from}
            size={25}
          />
        </div>
        <div class="col-span-7">
          {#if chat.lastMessage.text.match(urlRegex) || chat.lastMessage.text.match(hostedFilesRegex)}
            <AsidePreviewLink link={chat.lastMessage.text} />
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
        {$date(new Date(`${chat.lastMessage.sentAt}Z`), {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </time>
    {:else}
      <p class="first-letter:capitalize">{$t('common.message', { values: { count: 0 } })}</p>
    {/if}
  </div>
</a>
