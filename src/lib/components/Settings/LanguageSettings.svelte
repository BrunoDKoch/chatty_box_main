<script lang="ts">
  // TODO: fix glitch that's making select disappear when changing lang to or from English
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
      method: 'PUT'
    }).then((data) => data);
</script>

<select bind:value={$locale} class="select capitalize" name="lang" id="lang">
  {#each languageNames as lang}
    <option value={lang.value}>{lang.name}</option>
  {/each}
</select>
