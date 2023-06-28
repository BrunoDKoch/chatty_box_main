<script lang="ts">
  import Modal from '$lib/components/Modals/Modal.svelte';
  import QrCodeModal from '$lib/components/Modals/QrCodeModal.svelte';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher, onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  import { finishMFADisabling, startMFADisabling } from '$lib/useAuth';
  import PasswordModal from './PasswordModal.svelte';
  import useError from '$lib/useError';
  let enabledPromise = connection.invoke<boolean>('GetMFASettings').then((data) => data);
  const dispatch = createEventDispatcher();
  let token = '';
  $: recoveryCodes = [] as string[];
  let showQRCode = false;

  // For disabling MFA
  let showPasswordModal = false;
  let password = '';

  // For toggling loading button mode
  $: loading = false;

  connection.on('mfaToken', (data: { token: string; recoveryCodes: string[] }) => {
    token = data.token;
    recoveryCodes = data.recoveryCodes;
    recoveryCodes = recoveryCodes;
    setTimeout(() => {
      showQRCode = true;
    }),
      500;
  });
  async function handleChange(enable: boolean) {
    loading = true;
    if (!enable) {
      await startMFADisabling();
      showPasswordModal = true;
    } else await connection.invoke('SetMFASettings', enable);
    loading = false;
  }
  async function handlePasswordSubmission() {
    loading = true;
    try {
      await finishMFADisabling({ password });
      showPasswordModal = false;
    } catch (err) {
      console.error(err);
      $useError = err as App.Error;
      $useError.cause = $t(`error.cause.${(err as App.Error).status}`);
    } finally {
      loading = false;
    }
  }
</script>

<Modal on:close>
  {#await enabledPromise}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:then enabled}
    <div
      class="flex items-center justify-center gap-3 lg:text-xl {enabled
        ? 'text-success'
        : 'text-warning'}"
    >
      <iconify-icon class="text-4xl" icon={enabled ? 'mdi:check' : 'material-symbols:warning'} />
      <h1 class="font-bold uppercase">
        {$t('security.mfa.mfa')}
        {$t('common.is.temp')}
        {enabled ? $t('common.enabled.f') : $t('common.disabled.f')}
      </h1>
    </div>
    <p class="lg:w-[45rem]">
      {$t('security.mfa.mfaNotice')}
    </p>
    <div class="modal-action">
      <div class="join">
        <Button
          id="mfa-toggle"
          buttonUIType={enabled ? 'error' : 'info'}
          bind:loading
          on:click={async () => await handleChange(!enabled)}
          joinItem
        >
          {enabled ? $t('common.disable') : $t('common.enable')}
        </Button>
        <Button
          id="mfa-toggle"
          buttonUIType="neutral"
          bind:loading
          on:click={() => dispatch('close')}
          joinItem
        >
          {$t('common.cancel')}
        </Button>
      </div>
    </div>
  {/await}
</Modal>

{#if showQRCode}
  <QrCodeModal on:close={() => (showQRCode = false)} {token} {recoveryCodes} />
{:else if showPasswordModal}
  <PasswordModal
    on:close={() => (showPasswordModal = !showPasswordModal)}
    on:submit={async () => await handlePasswordSubmission()}
    bind:loading
    bind:password
  />
{/if}
