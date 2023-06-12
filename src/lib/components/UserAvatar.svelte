<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import type { UserDetailedResponse, UserPartialResponse } from '$lib/types/partialTypes';
  import UserModal from '$lib/components/Modals/UserModal.svelte';
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
          className: size <= 25 ? 'w-6 h-6' : 'w-12 h-12',
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
  class="avatar {user.avatar ? '' : 'placeholder'} cursor-pointer mask mask-squircle {lowerOpacity
    ? 'opacity-50'
    : 'opacity-100'} {className} {isChatImage ? 'chat-image' : ''}"
>
  <div class="w-[{rawSize}px] rounded-lg bg-blue-600 dark:bg-blue-800 font-bold text-white text-center text-{textSize}">
    {#if user.avatar}
      <img src="{PUBLIC_IMAGES_URL}/{user.avatar}?width={rawSize}" alt="{user.userName} avatar" />
    {:else}
    <span class="">
      {user.userName[0]}
    </span>
    {/if}
  </div>
</figure>

{#if showModal}
  <div class="absolute">
    <UserModal on:close={() => (showModal = false)} userId={user.id} />
  </div>
{/if}
