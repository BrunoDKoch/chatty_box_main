<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import QrCodeModal from '$lib/components/QrCodeModal.svelte';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher, onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import { scale } from 'svelte/transition';
  $: enabled = false;
  const mfaMethods = ['sms', 'email', 'authenticator', null] as const;
  $: activeMethod = null as (typeof mfaMethods)[number];
  const dispatch = createEventDispatcher();
  let token = '';
  let showQRCode = false;

  connection.on('currentMFAOptions', (data: { isEnabled: boolean; providers: string[] }) => {
    enabled = data.isEnabled;
    console.log(data);
  });
  connection.on('mfaToken', (data) => {
    token = data;
    console.log(token);
    setTimeout(() => {
      if (activeMethod === 'authenticator') {
        showQRCode = true;
      }
    }),
      500;
  });
  async function handleChange(method: (typeof mfaMethods)[number]) {
    activeMethod = method;
    if (!method) {
      await connection.invoke('SetMFASettings', false, undefined);
      return;
    }
    await connection.invoke('SetMFASettings', true, method);
  }
  onMount(async () => {
    await connection.invoke('GetMFASettings');
  });
</script>

<Modal>
  <div class="flex items-end justify-end">
    <button on:click={() => dispatch('close')} class="btn btn-circle btn-sm">
      <iconify-icon icon="mdi:close" />
    </button>
  </div>
  <h1 class="text-center text-xl font-bold uppercase">
    {$t('security.mfa.mfa')}
    {$t('common.is.temp')}
    {enabled ? $t('common.enabled.f') : $t('common.disabled.f')}
  </h1>
  {#each mfaMethods as mfaMethod}
    {#if mfaMethod}
      <div class="form-control">
        <label class="label" for="">
          <span class="label-text first-letter:uppercase">
            {mfaMethod === 'sms'
              ? 'SMS'
              : mfaMethod === 'email'
              ? $t('auth.email')
              : $t('security.mfa.authenticator')}
          </span>
          <input
            class="radio"
            on:change={async () => await handleChange(mfaMethod)}
            checked={activeMethod === mfaMethod}
            type="radio"
            name=""
            id=""
          />
        </label>
      </div>
    {:else if enabled}
      <button on:click={async () => await handleChange(null)} class="btn"
        >{$t('common.disable')}</button
      >
    {/if}
  {/each}
</Modal>

{#if showQRCode}
  <QrCodeModal {token} />
{/if}
