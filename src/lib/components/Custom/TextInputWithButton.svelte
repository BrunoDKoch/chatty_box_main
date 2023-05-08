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
    | 'week'
    | 'number'
    | 'phone' = 'text';
  export let rules:
    | {
        condition: boolean;
        text: string;
      }[]
    | null = null;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let name: string | undefined;
  export let size: 'base' | 'small' | 'large' = 'base';
  let { inputSize, groupSize } = getSize();
  $: errorClass = '';
  $: ruleText = '';
  function checkRules() {
    if (!rules || !rules.length) return;
    const brokenRule = rules.find((r) => !!!r.condition);
    if (brokenRule) {
      ruleText = brokenRule.text;
      errorClass = 'input-error transition-all duration-300';
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
  function getSize() {
    switch (size) {
      case 'base':
        return {
          inputSize: '',
          groupSize: '',
        };
      case 'large':
        return { inputSize: 'input-lg', groupSize: 'input-group-lg' };
      case 'small':
        return { inputSize: 'input-sm', groupSize: 'input-group-sm' };
    }
  }
</script>

<div class="input-group {groupSize}">
  <input
    id={name}
    use:getType
    class="input input-bordered {inputSize} {!disabled ? errorClass : 'input-disabled'}"
    bind:value
    {required}
    {name}
    {disabled}
    on:input={() => {
      checkRules();
      dispatch('update');
    }}
  />
  <slot />
</div>
