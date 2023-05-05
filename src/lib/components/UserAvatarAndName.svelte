<script lang="ts">
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import UserAvatar from './UserAvatar.svelte';

  export let user: UserPartialResponse;
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  let textSize = size === 'full' ? '6xl' : typeof size === 'number' && size <= 25 ? 'base' : '3xl';
</script>

<div class="grid grid-cols-4 gap-3 items-center">
  <UserAvatar {user} {size} {isChatImage} />
  <p class="col-span-3 font-bold text-{textSize}">{user.userName}</p>
</div>
