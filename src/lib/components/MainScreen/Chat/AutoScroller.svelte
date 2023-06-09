<script lang="ts">
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  export let skip: number;
  export let hasMore: boolean = false;
  let thisElement: HTMLElement;
  let fetching = false;
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !$chat.hasFetched) {
      fetching = true;
      setTimeout(async () => {
        if (!entry.isIntersecting) {
          fetching = false;
          return;
        }
        await connection.invoke('GetChat', $chat.id, skip);
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
        observer.observe(thisElement);
      }, 200);
    }
  }

  $: hasMore, setUpObserver();

  function setUpObserver() {
    if (!hasMore) return;
    return setTimeout(() => observer.observe(thisElement), 1500);
  }
  onMount(() => setUpObserver());
</script>

{#if hasMore}
  <div bind:this={thisElement} class="flex flex-col items-center justify-center">
    {#if fetching && !$chat.hasFetched}
      <iconify-icon icon="svg-spinners:6-dots-scale" />
    {:else}
      <p class="first-letter:uppercase text-center">
        {$t('common.more')}
        {$t('common.message', { values: { count: 15 } })}
      </p>
    {/if}
    <div class="divider" />
  </div>
{/if}
