<script lang="ts">
  export let options: {
    name: string,
    value: string | number
  }[];
  export let value: string | number;
  export let labelText: string;
  export let rules:
    | {
        condition: boolean;
        text: string;
      }[]
    | null = null;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let name: string | undefined;
  $: errorClass = '';
  $: ruleText = '';
  function checkRules() {
    if (!rules || !rules.length) return;
    const brokenRule = rules.find((r) => !!!r.condition);
    if (brokenRule) {
      ruleText = brokenRule.text;
      errorClass = ''
    } else {
      ruleText = '';
      errorClass = '';
    }
    rules = rules;
  }
</script>

<div class="form-control">
  <label for="{name}" class="label">
    <span class="label-text first-letter:uppercase">{required ? labelText + '*' : labelText}</span>
  </label>
  <select on:change on:input bind:value {disabled} class="select capitalize select-bordered" {name}>
    {#each options as opt}
      <option class="capitalize" value="{opt.value}">{opt.name}</option>
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