<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';

  export let error: { status: number; cause: string; message: string };
  $: icon = getIcon(error.status);
  const dispatch = createEventDispatcher();
  function getIcon(status: number) {
    switch (status) {
      case 401:
        return 'mdi:shield-alert';
      case 402:
        return 'ph:money';
      case 403:
        return 'icon-park-solid:error';
      case 404:
        return 'mdi:cloud-question';
      case 405:
        return 'ic:baseline-not-interested';
      case 409:
        return 'mdi:database-alert';
      case 418:
        return 'icon-park-solid:teapot';
      case 429:
        return 'ic:baseline-front-hand';
      case 451:
        return 'tabler:prison';
      case 500:
        return 'mdi:server-off';
      case 502:
      case 503:
        return 'mdi:server-network-off';
      case 504:
        return 'mdi:clock-alert';
      default:
        return 'mdi:close-circle';
    }
  }
  const brokenUpMessage = error.message.split('\n');
</script>

<Modal modalType="error">
  <div class="grid grid-cols-[1fr_3fr] max-w-[100vw]">
    <iconify-icon class="row-span-2 self-center justify-self-center" {icon} height="5rem" />
    <h1 class="font-bold text-2xl">
      {error.status ?? 500} - {error.cause ?? 'Internal server error'}
    </h1>
    {#if error.message && brokenUpMessage}
      <div>
        {#each brokenUpMessage as portion}
          <p>{portion}</p>
        {/each}
      </div>
    {:else if error.message}
      <p>{error.message}</p>
    {/if}
  </div>
  <div class="modal-action">
    <button class="btn" on:click={() => dispatch('close')}>Entendido</button>
  </div>
</Modal>
