<script lang="ts">
  import { ofetch } from 'ofetch';
  import { locale, locales } from 'svelte-i18n';
  import Select from '../Custom/Select.svelte';

  $: languageNameParser = new Intl.DisplayNames([$locale!], { type: 'language' });
  $: languageNames = $locales.map((l) => {
    return {
      name: languageNameParser.of(l)!,
      value: l,
    };
  });
  $: $locale,
    ofetch('/api/lang', {
      body: { lang: $locale },
      method: 'PUT',
    }).then((data) => data);
</script>

{#if $locale}
  <div class="flex items-center justify-center">
    <Select labelText="" bind:value={$locale} name="lang" options={languageNames} />
  </div>
{/if}
