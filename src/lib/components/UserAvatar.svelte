<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';
  import type { UserDetailedResponse, UserPartialResponse } from '$lib/types/partialTypes';
  import useUserModal, { updateUser } from '$lib/useUserModal';
    import Image from './Custom/Image.svelte';
  export let user: UserDetailedResponse | UserPartialResponse;
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  export let lowerOpacity = false;
  export let disableModal = false;
  let { className, rawSize, textSize } = getWidthAndHeight();

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
  async function handleClick() {
    if (disableModal) return;
    $useUserModal = await updateUser(user);
  }
</script>

<button
  type="button"
  on:click={() => handleClick()}
  on:keydown={() => handleClick()}
  class:placeholder={user.avatar}
  class:chat-image={isChatImage}
  class="avatar mask mask-squircle {lowerOpacity ? 'opacity-50' : 'opacity-100'} {className}
    {disableModal ? 'cursor-default' : 'cursor-pointer'}"
>
  <figure
    id="user-avatar"
    class="w-[{rawSize}px] rounded-lg bg-blue-600 dark:bg-blue-800 font-bold text-white text-center text-{textSize}"
  >
    {#if user.avatar}
      <Image
        src="{PUBLIC_IMAGES_URL_DEV}/{user.avatar}?width={rawSize}"
        alt="{user.userName} avatar"
        additionalClasses={className}
        width={rawSize}
      />
    {:else}
      <span class="">
        {user.userName[0]}
      </span>
    {/if}
  </figure>
</button>
