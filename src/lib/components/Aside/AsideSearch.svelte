<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import TextInputWithButton from '../Custom/TextInputWithButton.svelte';
  export let search = '';
  let searchIcon: HTMLElement;
  let loadingIcon: HTMLElement;
  let searching = false;
</script>

<div class="form-control overflow-hidden">
  <TextInputWithButton
    type="search"
    bind:value={search}
    placeholder={$t('aside.searchChats', { values: { search: $t('common.search') } })}
    name="chatSearch"
    size="small"
  >
    <Button on:click={() => (searching = !searching)} joinItem size="sm">
      <label class="swap swap-rotate" for="submit">
        <input type="checkbox" bind:checked={searching} name="submit" />
        <iconify-icon
          icon="mdi:archive-search-outline"
          bind:this={searchIcon}
          class="swap-off"
          height="1.4rem"
        />
        <iconify-icon
          icon="svg-spinners:6-dots-scale"
          bind:this={loadingIcon}
          class="swap-on"
          height="1.4rem"
        />
      </label>
    </Button>
  </TextInputWithButton>
</div>
