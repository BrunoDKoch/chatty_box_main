<script lang="ts">
  export let itemsPerPage: number;
  export let total: number;
  export let activePage: number;
  let pages = Math.ceil(total / itemsPerPage);
</script>

<div class="btn-group">
  {#each { length: pages } as _, pageNumber}
    <button
      on:click={() => (activePage = pageNumber + 1)}
      class="btn {pageNumber + 1 === activePage ? 'btn-active' : ''}"
    >
      {pageNumber + 1}
    </button>
  {/each}
</div>
