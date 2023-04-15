<script lang="ts">
  import AsideMsg from './AsideMsg.svelte';
  import type { MessagePreview } from '$lib/types/partialTypes';
  import AsideSearch from './AsideSearch.svelte';

  export let messages: MessagePreview[];
</script>

<div class="flex max-w-[25vw] flex-col gap-3">
  <div class="flex">
    <button class="btn btn-ghost">
      <iconify-icon icon="mdi:menu" height="1.4rem" />
    </button>
    <AsideSearch />
  </div>
  {#each messages as message}
    <AsideMsg {message} />
  {/each}
</div>
