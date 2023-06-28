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
  $: isCurrentSession = session.isCurrentSession;
</script>

<tr class="text-center {isCurrentSession ? 'bg-success-content' : 'bg-error-content'}">
  <th>
    {#if !isCurrentSession}
      <input
        on:change={() => dispatch('selectToggle', session.id)}
        type="checkbox"
        class="checkbox-info {isCurrentSession ? 'tooltip' : ''}"
        name="session-{index}"
        id="session-{index}"
      />
    {/if}
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
