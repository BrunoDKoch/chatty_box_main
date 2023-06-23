<script lang="ts">
  import { ofetch } from 'ofetch';
  import { locale, locales } from 'svelte-i18n';
  $: languageNameParser = new Intl.DisplayNames([$locale!], { type: 'language' });
  $: languageNames = $locales.map((l) => {
    return {
      name: languageNameParser.of(l),
      value: l,
    };
  });
  $: $locale,
    ofetch('/api/lang', {
      body: { lang: $locale },
      method: 'PUT',
    }).then((data) => data);
</script>

<div class="flex items-center justify-center">
  <select bind:value={$locale} class="select capitalize" name="lang" id="lang">
    {#each languageNames as lang}
      <option value={lang.value}>
        <span>{lang.name}</span>
      </option>
    {/each}
  </select>
</div>
