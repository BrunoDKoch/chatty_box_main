<script lang="ts">
  import AsideMsg from './AsidePreview.svelte';
  import type { ChatPreview, MessagePreview } from '$lib/types/partialTypes';
  import AsideSearch from './AsideSearch.svelte';
  import { chat } from '$lib/useActiveChat';
  import { onMount } from 'svelte';
  $chat.users[0]
  export let chats: ChatPreview[];
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center">
    <button class="btn btn-ghost">
      <iconify-icon icon="mdi:menu" height="1.4rem" />
    </button>
    <AsideSearch />
  </div>
  <div class="flex flex-col even:bg-base-300">
    {#each chats as chat}
      <AsideMsg {chat} />
    {/each}
  </div>
</div>
