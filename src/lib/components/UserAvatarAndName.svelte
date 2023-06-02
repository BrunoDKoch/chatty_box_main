<script lang="ts">
  import type { UserDetailedResponse, UserPartialResponse } from '$lib/types/partialTypes';
  import UserAvatar from './UserAvatar.svelte';

  export let user: UserDetailedResponse | UserPartialResponse;
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  export let lowerOpacity = false;
  export let extraText: string | undefined = undefined;
  export let disableModal = false;
</script>

<div class="grid max-md:grid-cols-3 lg:grid-cols-5 py-5 lg:gap-3 items-center">
  <UserAvatar {user} {size} {isChatImage} {lowerOpacity} {disableModal} />
  <div class="lg:col-span-3 flex flex-col {lowerOpacity ? 'opacity-50' : 'opacity-100'}">
    <p>{user.userName}</p>
    {#if extraText}
      <p class="first-letter:uppercase">{extraText}</p>
    {/if}
  </div>
  <slot />
</div>
