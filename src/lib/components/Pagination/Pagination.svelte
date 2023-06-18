<script lang="ts">
    import Button from '../Custom/Button.svelte';
  import PageButton from './PageButton.svelte';

  export let itemsPerPage: number;
  export let total: number;
  export let activePage: number;
  let pages = Math.ceil(total / itemsPerPage);
</script>

<div class="join">
  {#if pages < 5}
    {#each { length: pages } as _, pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
  {:else if activePage <= 2}
    {#each { length: 3 } as _, pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
    <Button disabled>...</Button>
    <PageButton bind:activePage pageNumber={pages - 1} />
  {:else if activePage < pages - 2}
    <PageButton bind:activePage pageNumber={0} />
    <Button disabled>...</Button>
    {#each [activePage - 2, activePage -1, activePage] as pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
    {#if activePage !== pages - 1}
      <Button disabled>...</Button>
      <PageButton bind:activePage pageNumber={pages - 1} />
    {/if}
    {:else}
    <PageButton bind:activePage pageNumber={0} />
    <Button disabled>...</Button>
    {#each [pages - 3, pages - 2, pages - 1] as pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
  {/if}
</div>
