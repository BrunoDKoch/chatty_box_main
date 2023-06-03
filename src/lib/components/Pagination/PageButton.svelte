<script lang="ts">
  export let activePage: number;
  export let pageNumber: number;
</script>

<button
  on:click={() => (activePage = pageNumber + 1)}
  class="btn join-item {pageNumber + 1 === activePage ? 'btn-active' : ''}"
>
  {pageNumber + 1}
</button>
