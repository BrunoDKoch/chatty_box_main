<script lang="ts">
  import type { ClientConnectionPartialInfo } from '$lib/types/partialTypes';
  import { toKebabCase } from '$lib/useCaseConversion';
  import { locale } from 'svelte-i18n';
  import SessionsTableRow from './SessionsTableRow.svelte';

  export let headers: string[];
  export let sessions: ClientConnectionPartialInfo[];
  const countryNames = new Intl.DisplayNames([$locale!], { type: 'region' });
  const browserIcons = {
    // cSpell:disable
    firefox: 'simple-icons:firefoxbrowser',
    ie: 'simple-icons:internetexplorer',
    chrome: 'simple-icons:googlechrome',
    chromium: 'simple-icons:googlechrome',
    safari: 'simple-icons:safari',
    edge: 'simple-icons:microsoftedge',
    opera: 'simple-icons:opera',
    samsung: 'simple-icons:samsung',
    unknown: 'material-symbols:question-mark',
  };
  // cSpell:enable
  const osIcons = {
    linux: 'simple-icons:linux',
    macos: 'file-icons:finder',
    ios: 'simple-icons:apple',
    android: 'simple-icons:android',
    windows: 'simple-icons:windows11',
    unknown: 'material-symbols:device-unknown',
  };
  function getIconFromObject(objectName: 'osIcons' | 'browserIcons', iconName: string) {
    const iconObjects = { browserIcons, osIcons };
    const relevantObject = iconObjects[objectName];
    if (iconName in relevantObject) return relevantObject[iconName as keyof typeof relevantObject];
    return relevantObject.unknown;
  }
  function getIcons(info: ClientConnectionPartialInfo) {
    let deviceIcon = info.os.toLowerCase().includes('android') || info.os.toLowerCase().includes('ios')
      ? 'material-symbols:phone-android-outline'
      : 'teenyicons:computer-outline';
    let osIcon = getIconFromObject('osIcons', info.os.toLowerCase().split(' ').at(0)!);
    let browserIcon = getIconFromObject(
      'browserIcons',
      info.browser.toLowerCase().split(' ').at(0)!,
    );
    let activeIcon = info.active ? 'mdi:check' : 'mdi:close';
    let countryIcon = `twemoji:flag-${toKebabCase(info.countryName)}`;
    return { deviceIcon, browserIcon, osIcon, activeIcon, countryIcon };
  }
  function getCountryName(info: ClientConnectionPartialInfo) {
    return countryNames.of(info.countryIsoCode) ?? 'unknown'
  }
</script>

<table class="table table-compact">
  <thead>
    <tr>
      <th />
      {#each headers as header}
        <th class="text-center first-letter:uppercase">{header}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sessions as session}
      <SessionsTableRow
        on:selectToggle
        bind:session
        index={sessions.indexOf(session) + 1}
        icons={getIcons(session)}
        countryName={getCountryName(session)}
      />
    {/each}
  </tbody>
</table>
