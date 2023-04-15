<script lang="ts">
  import AsideMsg from './AsideMsg.svelte';
  import type { MessagePreview } from '$lib/types/partialTypes';

  export let messages: MessagePreview[];
</script>

<div class="flex flex-col gap-3">
  {#each messages as message}
    <AsideMsg {message} />
  {/each}
</div>
