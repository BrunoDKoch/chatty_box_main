<script lang="ts">
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
      errorClass =
        type !== 'area'
          ? 'input-error transition-all duration-300'
          : 'textarea-error transition-all duration-300';
    } else {
      ruleText = '';
      errorClass = '';
    }
    rules = rules;
  }
  const dispatch = createEventDispatcher();
  function getType(node: HTMLInputElement) {
    node.type = type;
  }
</script>

<div class="form-control">
  <label for="{name}" class="label">
    <span class="label-text first-letter:uppercase">{required ? labelText + '*' : labelText}</span>
  </label>
  {#if type !== 'area'}
    <input
      id={name}
      use:getType
      class={!disabled
        ? `input input-bordered ${errorClass}`
        : 'input input-bordered input-disabled'}
      bind:value
      {required}
      {name}
      {disabled}
      on:input={() => {
        checkRules();
        dispatch('update');
      }}
    />
  {:else}
    <textarea
      class={!disabled
        ? `textarea textarea-bordered ${errorClass}`
        : 'textarea textarea-bordered textarea-disabled'}
      bind:value
      {required}
      {name}
      cols="80"
      rows="10"
      {disabled}
      on:input={() => {
        checkRules();
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
