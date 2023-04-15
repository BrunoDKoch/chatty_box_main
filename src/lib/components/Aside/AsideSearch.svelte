<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  export let search = '';
  let searchIcon: HTMLElement;
  let loadingIcon: HTMLElement;
  let searching = false;
</script>

<div class="form-control max-w-[20vw]">
  <div class="input-group input-group-sm max-w-[20vw]">
    <input
      type="search"
      class="input max-w-[16.2vw] capitalize"
      bind:value={search}
      placeholder={$t('aside.searchChats', { values: { search: ($t('common.search')) } })}
    />
    <button on:click={() => (searching = !searching)} class="btn btn-square">
      <label class="swap swap-rotate" for="submit">
        <input type="checkbox" bind:checked={searching} name="submit" />
        <iconify-icon icon="mdi:archive-search-outline" bind:this={searchIcon} class="swap-off" height="1.4rem" />
        <iconify-icon icon="svg-spinners:6-dots-scale" bind:this={loadingIcon} class="swap-on" height="1.4rem" />
      </label>
    </button>
  </div>
</div>
