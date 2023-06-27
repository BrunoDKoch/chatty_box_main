<script lang="ts">
  export let options: {
    name: string;
    value: string | number;
  }[];
  export let value: string | number;
  export let labelText: string;
  export let rules:
    | {
        condition: boolean;
        text: string;
      }[]
    | null = null;
  export let required = false;
  export let disabled = false;
  export let name: string | undefined;
  $: errorClass = '';
  $: ruleText = '';
  $: value, checkRules();
  function checkRules() {
    if (!rules || !rules.length) return;
    const brokenRule = rules.find((r) => !r.condition);
    if (brokenRule) {
      ruleText = brokenRule.text;
      errorClass = '';
    } else {
      ruleText = '';
      errorClass = '';
    }
    rules = rules;
  }
</script>

<div class="form-control">
  {#if labelText}
    <label for={name} class="label">
      <span class="label-text first-letter:uppercase">
        {required ? labelText + '*' : labelText}
      </span>
    </label>
  {/if}
  <select on:change on:input bind:value {disabled} class="select capitalize select-bordered" {name}>
    {#each options as { value, name }}
      <option class="first-letter:capitalize" {value}>
        {name.replace(name[0], name[0].toUpperCase())}
      </option>
    {/each}
  </select>
  <p class="label">
    {#if ruleText}
      <span class="label-text text-error">{ruleText}</span>
    {:else}
      <span class="label-text w-full"> &#160;&#160;&#160; </span>
    {/if}
  </p>
</div>
