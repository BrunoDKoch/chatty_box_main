<script lang="ts">
  import PageButton from './PageButton.svelte';

  export let itemsPerPage: number;
  export let total: number;
  export let activePage: number;
  let pages = Math.ceil(total / itemsPerPage);
</script>

<div class="btn-group">
  {#if pages < 5}
    {#each { length: pages } as _, pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
  {:else if activePage <= 2}
    {#each { length: 3 } as _, pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
    <button class="btn btn-disabled">...</button>
    <PageButton bind:activePage pageNumber={pages - 1} />
  {:else if activePage < pages - 2}
    <PageButton bind:activePage pageNumber={0} />
    <button class="btn btn-disabled">...</button>
    {#each [activePage - 2, activePage -1, activePage] as pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
    {#if activePage !== pages - 1}
      <button class="btn btn-disabled">...</button>
      <PageButton bind:activePage pageNumber={pages - 1} />
    {/if}
    {:else}
    <PageButton bind:activePage pageNumber={0} />
    <button class="btn btn-disabled">...</button>
    {#each [pages - 3, pages - 2, pages - 1] as pageNumber}
      <PageButton bind:activePage {pageNumber} />
    {/each}
  {/if}
</div>
