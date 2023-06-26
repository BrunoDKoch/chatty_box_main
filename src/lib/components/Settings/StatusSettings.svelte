<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import Select from '../Custom/Select.svelte';
  import { statusOptions } from '$lib/types/otherTypes';
  import { t } from 'svelte-i18n';
  const options = statusOptions.map((so) => {
    const { name, value } = so;
    return {
      value,
      name: $t(name),
    };
  });
  let status = connection.invoke<string | null>('GetStatus').then((data) => data ?? '');
  async function handleChange(target: EventTarget) {
    const { value } = target as HTMLSelectElement;
    status = connection
      .invoke<string | null>('UpdateStatus', value ? value : undefined)
      .then((data) => data ?? '');
  }
</script>

{#await status}
  <iconify-icon icon="svg-spinners:6-dots-scale" />
{:then value}
  <Select
    on:change={async (e) => {
      if (!e || !e.target) return;
      await handleChange(e.target);
    }}
    {value}
    labelText="status"
    name="status"
    {options}
  />
{/await}
