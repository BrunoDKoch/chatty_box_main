<script lang="ts">
  import { createEventDispatcher, onMount, SvelteComponentTyped } from 'svelte';
  import { DateInput, localeFromDateFnsLocale } from 'date-picker-svelte';
  import { theme } from '$lib/theme';
  import { ptBR } from 'date-fns/locale';
  import { useShortFormat } from '$lib/useDateFormat';
  export let value: Date;
  export let labelText: string;
  export let rules:
    | {
        condition: boolean;
        text: string;
      }[]
    | null = null;
  export let required: boolean = false;
  export let disabled: boolean = false;

  const locale = localeFromDateFnsLocale(ptBR);

  let inputElement: SvelteComponentTyped;

  $: errorClass = '';
  $: ruleText = '';
  function checkRules() {
    if (!rules || !rules.length) return;
    const brokenRule = rules.find((r) => !!!r.condition);
    if (brokenRule) {
      ruleText = brokenRule.text;
      errorClass = 'input-error';
    } else {
      ruleText = '';
      errorClass = '';
    }
    inputElement.$set({ class: errorClass });
    rules = rules;
  }
  const dispatch = createEventDispatcher();
  onMount(() => {
    const root = document.querySelector(':root') as HTMLElement;

    theme.subscribe((t) =>
      root.style.setProperty(
        '--date-picker-background',
        t === 'dark' ? 'hsla(var(--b1) / var(--tw-bg-opacity, 1))' : 'white',
      ),
    );
  });
</script>

<svelte:body />

<div class="form-control">
  <p class="label">
    <span class="label-text">{required ? labelText + '*' : labelText}</span>
  </p>
  <DateInput
    bind:this={inputElement}
    {disabled}
    on:input={() => {
      checkRules();
      dispatch('update');
    }}
    {locale}
    bind:value
    placeholder={useShortFormat(new Date())}
    format="dd/MM/yyyy, HH:mm"
  />
  <p class="label">
    {#if ruleText}
      <span class="label-text text-error">{ruleText}</span>
    {:else}
      <span class="label-text w-full"> &#160;&#160;&#160; </span>
    {/if}
  </p>
</div>

<style>
  div {
    --date-picker-background: hsl(var(--b1) / var(--tw-bg-opacity));
    --date-picker-foreground: hsla(var(--bc) / var(--tw-text-opacity, 1));
    --date-input-width: 100%;
  }
</style>
