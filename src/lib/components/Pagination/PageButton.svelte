<script lang="ts">
  import { page } from '$app/stores';
  import Button from '../Custom/Button.svelte';

  export let activePage: number;
  export let pageNumber: number;
  export let useLinks = false;
  console.log({ activePage, pageNumber });
</script>

<Button
  link={useLinks ? `${$page.url.pathname}?p=${pageNumber}` : ''}
  on:click={() => (activePage = pageNumber)}
  joinItem
  className={pageNumber === activePage ? 'btn-active' : ''}
>
  {pageNumber}
</Button>
