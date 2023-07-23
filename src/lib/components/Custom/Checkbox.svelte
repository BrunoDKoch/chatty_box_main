<script lang="ts">
  export let checked: boolean;
  export let name: string;
  export let labelText: string;
  export let labelIsClickable = false;
</script>

<div class="form-control">
  <label for={name} class="label gap-2">
    <span class="label-text first-letter:uppercase">
      {#if labelIsClickable}
        <button type="button" on:click class="link">{labelText}</button>
      {:else}
        {labelText}
      {/if}
    </span>
    <input id={name} class="checkbox" type="checkbox" {name} bind:checked />
  </label>
</div>
