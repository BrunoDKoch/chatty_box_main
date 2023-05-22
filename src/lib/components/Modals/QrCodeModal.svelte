<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import QRCode from 'qrcode';
  import Modal from './Modal.svelte';
  import { t } from 'svelte-i18n';
  export let token: string;
  export let recoveryCodes: string[];
  const dispatch = createEventDispatcher();
  let codeElement: HTMLImageElement;
  QRCode.toDataURL(token).then((url) => (codeElement.src = url));
</script>

<Modal>
  <div class="flex flex-col items-center justify-center">
    <img bind:this={codeElement} alt="QR Code" />
    <h3 class="text-lg font-semibold text-center">Scan the code above</h3>
    <button on:click={() => dispatch('close')} class="btn">Done</button>
  </div>
  <div>
    <h2 class="font-bold text-2xl">
      {$t('common.code', { values: { item: $t('auth.recovery'), codeCount: 10 } })}
    </h2>
    {#each recoveryCodes as recoveryCode}
      <p>{recoveryCode}</p>
    {/each}
  </div>
</Modal>
