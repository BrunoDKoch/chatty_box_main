<script lang="ts">
  import useError from '$lib/useError';
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';
</script>

<main class="dark:bg-black h-screen w-screen overflow-hidden">
  <slot />
</main>

{#if $useError}
  <ErrorModal error={$useError} on:close={() => ($useError = null)} />
{/if}
