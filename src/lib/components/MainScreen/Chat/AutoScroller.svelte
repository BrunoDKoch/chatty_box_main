<script lang="ts">
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  export let skip: number;
  export let hasMore = false;
  $: fetching = false;
  let thisElement: HTMLElement;

  const dispatch = createEventDispatcher();

  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !$chat.hasFetched) {
      fetching = true;
      setTimeout(async () => {
        if (!entry.isIntersecting) {
          fetching = false;
          return;
        }
        await getChatMessages();
      }, 200);
    }
  });
  $: {
    if (hasMore && fetching) observer.unobserve(thisElement);
  }
  $: {
    if ($chat.hasFetched) {
      fetching = false;
      setTimeout(() => {
        $chat.hasFetched = false;
        if ($chat.hasMore) observer.observe(thisElement);
      }, 1000);
    }
  }

  $: hasMore, setUpObserver();

  function setUpObserver() {
    try {
      if (!hasMore) {
        observer.disconnect();
        return;
      }
      return setTimeout(() => observer.observe(thisElement), 1500);
    } catch {
      return;
    }
  }
  async function getChatMessages() {
    dispatch('fetching');
    return await connection.invoke('GetChat', $chat.id, skip);
  }
  onMount(() => setUpObserver());
  onDestroy(() => observer.disconnect());
</script>

{#if hasMore}
  <header class="flex flex-col">
    <button
      on:click={async () => await getChatMessages()}
      bind:this={thisElement}
      id="auto-scroller"
      class="flex flex-col items-center justify-center"
    >
      {#if fetching && !$chat.hasFetched}
        <iconify-icon icon="svg-spinners:6-dots-scale" />
      {:else}
        <p class="first-letter:uppercase text-center">
          {$t('common.more')}
          {$t('common.message', { values: { count: 15 } })}
        </p>
      {/if}
      <div class="divider" />
    </button>
  </header>
{/if}
