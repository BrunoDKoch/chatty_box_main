<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import type { UserDetailedResponse, UserPartialResponse } from '$lib/types/partialTypes';
  import UserModal from './UserModal.svelte';
  export let user: UserDetailedResponse | UserPartialResponse;
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  export let lowerOpacity = false;
  export let disableModal = false;
  let { className, rawSize, textSize } = getWidthAndHeight();
  let showModal = false;
  function getWidthAndHeight() {
    switch (size) {
      case 'full':
        return { className: 'w-24 h-24', rawSize: 150, textSize: '7xl' };
      case 'half':
        return { className: 'w-12 h-12', rawSize: 75, textSize: '4xl' };
      default:
        return {
          className: `w-[${size}px] h-[${size}px]`,
          rawSize: size,
          textSize: size <= 25 ? 'base' : '3xl',
        };
    }
  }
  function handleClick() {
    if (disableModal) return;
    showModal = !showModal;
  }
</script>

<figure
  on:click={() => handleClick()}
  on:keydown={() => handleClick()}
  class="avatar cursor-pointer mask mask-squircle {lowerOpacity
    ? 'opacity-50'
    : 'opacity-100'} {className} {isChatImage ? 'chat-image' : ''}"
>
  {#if user.avatar}
    <img src="{PUBLIC_IMAGES_URL}/{user.avatar}?width={rawSize}" alt="{user.userName} avatar" />
  {:else}
    <div class="flex min-h-full">
      <div
        class="flex items-center justify-center min-h-full bg-blue-600 text-white dark:bg-blue-800"
      >
        <p class="font-bold text-white text-center px-3 text-{textSize}">
          {user.userName[0]}
        </p>
      </div>
    </div>
  {/if}
</figure>

{#if showModal}
  <div class="absolute">
    <UserModal on:close={() => (showModal = false)} {user} />
  </div>
{/if}
