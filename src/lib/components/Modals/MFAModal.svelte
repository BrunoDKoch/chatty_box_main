<script lang="ts">
  import Modal from '$lib/components/Modals/Modal.svelte';
  import QrCodeModal from '$lib/components/Modals/QrCodeModal.svelte';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher, onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import { scale } from 'svelte/transition';
  $: enabled = false;
  const dispatch = createEventDispatcher();
  let token = '';
  $: recoveryCodes = [] as string[];
  let showQRCode = false;

  connection.on('currentMFAOptions', (data: { isEnabled: boolean; providers: string[] }) => {
    enabled = data.isEnabled;
    console.log(data);
  });
  connection.on('mfaToken', (data: { token: string; recoveryCodes: string[] }) => {
    token = data.token;
    recoveryCodes = data.recoveryCodes;
    recoveryCodes = recoveryCodes;
    console.log(token);
    setTimeout(() => {
      showQRCode = true;
    }),
      500;
  });
  async function handleChange(enable: boolean) {
    await connection.invoke('SetMFASettings', enable);
  }
  onMount(async () => {
    await connection.invoke('GetMFASettings');
  });
</script>

<Modal on:close>
  <h1 class="text-center text-xl font-bold uppercase">
    {$t('security.mfa.mfa')}
    {$t('common.is.temp')}
    {enabled ? $t('common.enabled.f') : $t('common.disabled.f')}
  </h1>
  <button on:click={async () => await handleChange(!enabled)} class="btn">
    {enabled ? $t('common.disable') : $t('common.enable')}
  </button>
</Modal>

{#if showQRCode}
  <QrCodeModal on:close={() => (showQRCode = false)} {token} {recoveryCodes} />
{/if}
