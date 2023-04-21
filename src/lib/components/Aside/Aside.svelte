<script lang="ts">
  import AsideMsg from './AsidePreview.svelte';
  import type { ChatPreview } from '$lib/types/partialTypes';
  import AsideSearch from './AsideSearch.svelte';
  import { t } from 'svelte-i18n';
  import useActiveScreen from '$lib/useActiveScreen';
  export let chats: ChatPreview[];
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center">
    <button class="btn btn-ghost">
      <iconify-icon icon="mdi:menu" height="1.4rem" />
    </button>
    <AsideSearch />
  </div>
  <div
    on:keydown={() => ($useActiveScreen = 'friends')}
    on:click={() => ($useActiveScreen = 'friends')}
    class="flex py-2 gap-3 items-center cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-700"
  >
    <iconify-icon icon="material-symbols:person" />
    <p class="capitalize">{$t('common.friend')}s</p>
  </div>
  <div class="divider" />
  <div class="flex flex-col even:bg-base-300">
    {#each chats as chat}
      <AsideMsg {chat} />
    {/each}
  </div>
</div>
