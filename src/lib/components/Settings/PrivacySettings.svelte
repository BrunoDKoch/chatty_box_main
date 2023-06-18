<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import Select from '../Custom/Select.svelte';
  const options = [
    {
      value: 1,
      name: $t(`privacyLevel.1`),
    },
    {
      value: 2,
      name: $t('privacyLevel.2'),
    },
    {
      value: 3,
      name: $t('privacyLevel.3'),
    },
  ];
  $: privacyLevel = 0;
  $: {
    if (privacyLevel) {
      connection.invoke('SetPrivacySettings', privacyLevel).then((data) => data);
    }
  }
  connection.on('privacyLevel', (data: number) => {
    privacyLevel = data;
  });
  onMount(async () => {
    await connection.invoke('GetPrivacySettings');
  });
</script>

<div class="w-fit flex items-center justify-center">
  <div class="relative">
    <Select name="privacyLevel" labelText={$t('privacyLevel.who')} {options} bind:value={privacyLevel} />
  </div>
</div>
