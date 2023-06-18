<script lang="ts">
  import { goto } from '$app/navigation';
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';
  import useError from '$lib/useError';
  import { online } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  onMount(() => {
    if (!$online) return;
    return goto('/');
  });
</script>

<main>
  <slot />
  {#if $useError}
    <ErrorModal bind:error={$useError} on:close={() => ($useError = null)} />
  {/if}
</main>
