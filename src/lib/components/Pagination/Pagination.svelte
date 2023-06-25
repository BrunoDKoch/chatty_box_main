<script lang="ts">
  import Button from '../Custom/Button.svelte';
  import PageButton from './PageButton.svelte';

  export let itemsPerPage: number;
  export let total: number;
  export let activePage: number;
  export let useLinks = false;
  $: pages = Math.ceil(total / itemsPerPage);
</script>

{#if pages > 1}
  <div class="join z-50">
    {#if pages < 5}
      {#each { length: pages } as _, pageNumber}
        <PageButton {useLinks} bind:activePage pageNumber={pageNumber + 1} />
      {/each}
    {:else if activePage <= 2}
      {#each { length: 3 } as _, pageNumber}
        <PageButton {useLinks} bind:activePage pageNumber={pageNumber + 1} />
      {/each}
      <Button id="spacer" joinItem disabled>...</Button>
      <PageButton {useLinks} bind:activePage pageNumber={pages - 1} />
    {:else if activePage < pages - 2}
      <PageButton {useLinks} bind:activePage pageNumber={0} />
      <Button id="spacer" joinItem disabled>...</Button>
      {#each [activePage - 2, activePage - 1, activePage] as pageNumber}
        <PageButton {useLinks} bind:activePage pageNumber={pageNumber + 1} />
      {/each}
      {#if activePage !== pages - 1}
        <Button id="spacer" joinItem disabled>...</Button>
        <PageButton {useLinks} bind:activePage pageNumber={pages - 1} />
      {/if}
    {:else}
      <PageButton {useLinks} bind:activePage pageNumber={0} />
      <Button id="spacer" joinItem disabled>...</Button>
      {#each [pages - 3, pages - 2, pages - 1] as pageNumber}
        <PageButton {useLinks} bind:activePage pageNumber={pageNumber + 1} />
      {/each}
    {/if}
  </div>
{/if}
