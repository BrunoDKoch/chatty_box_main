<script lang="ts">
  import { page } from '$app/stores';
  import Button from '../Custom/Button.svelte';

  export let activePage: number;
  export let pageNumber: number;
  export let useLinks = false;
</script>

<Button
  id="page-{pageNumber}"
  link={useLinks ? `${$page.url.pathname}?p=${pageNumber}` : ''}
  on:click={() => (activePage = pageNumber)}
  joinItem
  additionalClasses={pageNumber === activePage ? 'btn-active' : ''}
>
  {pageNumber}
</Button>
