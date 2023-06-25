<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import QRCode from 'qrcode';
  import Modal from './Modal.svelte';
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  export let token: string;
  export let recoveryCodes: string[];
  const dispatch = createEventDispatcher();
  let codeElement: HTMLImageElement;
  QRCode.toDataURL(token).then((url) => (codeElement.src = url));
</script>

<Modal on:close>
  <div class="flex flex-col items-center justify-center">
    <img bind:this={codeElement} alt="QR Code" />
    <h3 class="text-lg font-semibold text-center">Scan the code above</h3>
    <Button id="done" on:click={() => dispatch('close')}>Done</Button>
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
