<script lang="ts">
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';
  import useError from '$lib/useError';
</script>

<main>
  <slot />
  {#if $useError}
    <ErrorModal bind:error={$useError} on:close={() => ($useError = null)} />
  {/if}
</main>

