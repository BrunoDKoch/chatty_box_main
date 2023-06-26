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
  export let required = false;
  export let disabled = false;
  export let name: string | undefined;
  export let size: 'base' | 'small' | 'large' = 'base';
  export let placeholder = '';
  let { inputSize } = getSize();
  $: errorClass = '';
  $: ruleText = '';
  function checkRules() {
    if (!rules || !rules.length) return;
    const brokenRule = rules.find((r) => !r.condition);
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
        };
      case 'large':
        return { inputSize: 'input-lg' };
      case 'small':
        return { inputSize: 'input-sm' };
    }
  }
</script>

<div class="join items-center overflow-hidden">
  <input
    id={name}
    use:getType
    class="input capitalize join-item input-bordered {inputSize} {!disabled
      ? errorClass
      : 'input-disabled'}"
    bind:value
    {required}
    {name}
    {disabled}
    {placeholder}
    on:input={() => {
      checkRules();
      dispatch('update');
    }}
  />
  <slot />
</div>
