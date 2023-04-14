<script lang="ts">
  export let checked: boolean;
  export let name: string;
  export let labelText: string;
</script>

<div class="form-control">
  <label for={name} class="label gap-2">
    <span class="label-text first-letter:uppercase">{labelText}</span>
    <input class="checkbox" type="checkbox" {name} bind:checked />
  </label>
</div>
