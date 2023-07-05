<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import Select from '../Custom/Select.svelte';
  import { statusOptions } from '$lib/types/otherTypes';
  import { t } from 'svelte-i18n';
  export let status: '' | 'busy' | 'away';
  const options = statusOptions.map((so) => {
    const { name, value } = so;
    return {
      value,
      name: $t(name),
    };
  });
  async function handleChange(target: EventTarget) {
    const { value } = target as HTMLSelectElement;
    status = ((await connection.invoke<string | null>('UpdateStatus', value ? value : undefined)) ??
      '') as typeof status;
  }
</script>

{#if status === null}
  <iconify-icon icon="svg-spinners:6-dots-scale" />
{:else}
  <Select
    on:change={async (e) => {
      if (!e || !e.target) return;
      await handleChange(e.target);
    }}
    bind:value={status}
    labelText="status"
    name="status"
    {options}
  />
{/if}
