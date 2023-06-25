<script lang="ts">
  import { toKebabCase } from '$lib/useCaseConversion';
  import { createEventDispatcher } from 'svelte';

  export let value: string | Date;
  export let type:
    | 'text'
    | 'password'
    | 'date'
    | 'datetime'
    | 'datetime-local'
    | 'email'
    | 'search'
    | 'time'
    | 'url'
    | 'area'
    | 'week'
    | 'number'
    | 'phone' = 'text';
  export let labelText: string = '';
  export let rules:
    | {
        condition: boolean;
        text: string;
      }[]
    | null = null;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let name: string;
  let inputElement: HTMLInputElement | HTMLTextAreaElement;
  $: ruleText = '';
  $: {
    if (value && rules && rules.length) {
      const brokenRule = rules.find((r) => !!!r.condition);
      if (brokenRule) {
        ruleText = brokenRule.text;
        inputElement.setAttribute('isvalid', 'false');
      } else {
        ruleText = '';
      }
    }
  }
  const dispatch = createEventDispatcher();
  function getType(node: HTMLInputElement) {
    node.type = type;
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
  {#if type !== 'area'}
    <input
      bind:this={inputElement}
      id={toKebabCase(name)}
      use:getType
      class="input input-bordered disabled:input-disabled invalid:input-error invalid:transition-all invalid:duration-300"
      bind:value
      {required}
      {name}
      {disabled}
      on:input={() => {
        dispatch('update');
      }}
    />
  {:else}
    <textarea
      class="textarea textarea-bordered disabled:textarea-disabled invalid:textarea-error invalid:transition-all invalid:duration-300"
      bind:this={inputElement}
      bind:value
      {required}
      {name}
      cols="80"
      rows="10"
      {disabled}
      on:input={() => {
        dispatch('update');
      }}
    />
  {/if}
  <p class="label">
    {#if ruleText}
      <span class="label-text text-error first-letter:capitalize">{ruleText}</span>
    {:else}
      <span class="label-text w-full"> &#160;&#160;&#160; </span>
    {/if}
  </p>
</div>
