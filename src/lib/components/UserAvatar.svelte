<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  export let user: UserPartialResponse;
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  const { className, rawSize, textSize } = getWidthAndHeight();
  function getWidthAndHeight() {
    switch (size) {
      case 'full':
        return { className: 'w-24 h-24', rawSize: 150, textSize: '6xl' };
      case 'half':
        return { className: 'w-12 h-12', rawSize: 75, textSize: '3xl' };
      default:
        return {
          className: `w-[${size}px] h-[${size}px]`,
          rawSize: size,
          textSize: size <= 25 ? 'base' : '3xl',
        };
    }
  }
</script>

<figure class="avatar mask mask-squircle {className} {isChatImage ? 'chat-image' : ''}">
  {#if user.avatar}
    <img src="{PUBLIC_IMAGES_URL}/{user.avatar}?width={rawSize}" alt="{user.userName} avatar" />
  {:else}
    <div class="flex min-h-full">
      <div
        class="flex items-center justify-center min-h-full text-{textSize} bg-blue-600 text-white dark:bg-blue-800"
      >
        <p class="font-bold text-white text-center px-3">
          {user.userName[0]}
        </p>
      </div>
    </div>
  {/if}
</figure>
