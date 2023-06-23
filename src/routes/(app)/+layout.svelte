<script lang="ts">
  import '../../app.css';
  import 'iconify-icon';
  import useError from '$lib/useError';
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';
</script>

<title>ChattyBox</title>

<main class="dark:bg-black h-screen w-screen overflow-hidden">
  <slot />
</main>

{#if $useError}
  <ErrorModal error={$useError} on:close={() => ($useError = null)} />
{/if}
