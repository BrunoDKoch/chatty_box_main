<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { connection } from '$lib/useSignalR';
  import type { ClientConnectionPartialInfo } from '$lib/types/partialTypes';
  import CloseButton from '../Custom/CloseButton.svelte';
  import { locale } from 'svelte-i18n';
  let sessions = connection
    .invoke<ClientConnectionPartialInfo[]>('GetConnections')
    .then((data) => data);
  const headers = ['Device', 'OS', 'Browser', 'Country', 'City', 'Active'];
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
    let deviceIcon = info.device.toLowerCase().includes('phone')
      ? 'material-symbols:phone-android-outline'
      : 'teenyicons:computer-outline';
    let osIcon = getIconFromObject('osIcons', info.os.toLowerCase().split(' ').at(0)!);
    let browserIcon = getIconFromObject('browserIcons', info.browser.toLowerCase().split(' ').at(0)!);
    let activeIcon = info.active ? 'mdi:check' : 'mdi:close';
    let countryIcon = `twemoji:flag-${info.countryName.toLowerCase().replaceAll(' ', '-')}`;
    return { deviceIcon, browserIcon, osIcon, activeIcon, countryIcon };
  }
</script>

<Modal>
  <CloseButton on:close />
  {#await sessions}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:then data}
    <table class="table table-compact">
      <thead>
        <tr>
          <th />
          {#each headers as header}
            <th class="first-letter:uppercase">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data as session}
          <tr class="text-center {session.active ? 'bg-success-content' : 'bg-error-content'}">
            <th>{data.indexOf(session) + 1}</th>
            <td>
              <iconify-icon icon={getIcons(session).deviceIcon} />
              <span>{session.device}</span>
            </td>
            <td>
              <iconify-icon icon={getIcons(session).osIcon} />
              <span>{session.os}</span>
            </td>
            <td>
              <iconify-icon icon={getIcons(session).browserIcon} />
              <span>{session.browser}</span>
            </td>
            <td>
              <iconify-icon icon={getIcons(session).countryIcon} />
              <span>
                {countryNames.of(session.countryIsoCode)}
              </span>
            </td>
            <td>{session.cityName}</td>
            <td>
              <iconify-icon icon={getIcons(session).activeIcon} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/await}
</Modal>
