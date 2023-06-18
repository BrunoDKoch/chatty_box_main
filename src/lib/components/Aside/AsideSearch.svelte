<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
    import Button from '../Custom/Button.svelte';
  export let search = '';
  let searchIcon: HTMLElement;
  let loadingIcon: HTMLElement;
  let searching = false;
</script>

<div class="form-control w-fit overflow-hidden">
  <div class="join overflow-hidden">
    <input
      type="search"
      class="input join-item input-sm capitalize w-48"
      bind:value={search}
      placeholder={$t('aside.searchChats', { values: { search: ($t('common.search')) } })}
    />
    <Button on:click={() => (searching = !searching)} joinItem size="sm" format="square">
      <label class="swap swap-rotate" for="submit">
        <input type="checkbox" bind:checked={searching} name="submit" />
        <iconify-icon icon="mdi:archive-search-outline" bind:this={searchIcon} class="swap-off" height="1.4rem" />
        <iconify-icon icon="svg-spinners:6-dots-scale" bind:this={loadingIcon} class="swap-on" height="1.4rem" />
      </label>
    </Button>
  </div>
</div>
