<script lang="ts">
  import type { ClientConnectionPartialInfo } from '$lib/types/partialTypes';
  import { createEventDispatcher } from 'svelte';

  export let session: ClientConnectionPartialInfo;
  export let index: number;
  export let icons: {
    deviceIcon: string;
    browserIcon: string;
    osIcon: string;
    activeIcon: string;
    countryIcon: string;
  };
  export let countryName: string;

  const dispatch = createEventDispatcher();
  const { deviceIcon, browserIcon, osIcon, activeIcon, countryIcon } = icons;
  console.log(session);
</script>

<tr class="text-center {session.isCurrentConnection ? 'bg-success-content' : 'bg-error-content'}">
  <th>
    <input
      on:change={() => dispatch('selectToggle', session.id)}
      type="checkbox"
      class="checkbox-info"
      name="session-{index}"
      id="session-{index}"
    />
  </th>
  <td>
    <div class="flex flex-col items-center justify-center">
      <iconify-icon icon={deviceIcon} class="max-lg:text-xl lg:text-4xl" />
      <span>{session.device}</span>
    </div>
  </td>
  <td>
    <div class="flex flex-col items-center justify-center">
      <iconify-icon icon={osIcon} class="max-lg:text-xl lg:text-4xl" />
      <span>{session.os}</span>
    </div>
  </td>
  <td>
    <div class="flex flex-col items-center justify-center">
      <iconify-icon icon={browserIcon} class="max-lg:text-xl lg:text-4xl" />
      <span>{session.browser}</span>
    </div>
  </td>
  <td>
    <div class="flex flex-col items-center justify-center">
      <iconify-icon icon={countryIcon} class="max-lg:text-xl lg:text-4xl" />
      <span>
        {countryName}
      </span>
    </div>
  </td>
  <td>{session.cityName}</td>
  <td>
    <iconify-icon icon={activeIcon} />
  </td>
</tr>
