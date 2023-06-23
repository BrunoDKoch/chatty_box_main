<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { date, t, time } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';

  export let error: { status: number; cause: string; message: string };
  $: icon = getIcon(error.status);
  const dispatch = createEventDispatcher();
  function getIcon(status: number) {
    switch (status) {
      case 400:
        return 'material-symbols:warning';
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
  let brokenUpMessage = [] as string[];
  onMount(() => {
    if (error.message.includes('\n')) {
      brokenUpMessage = error.message.split('\n');
    }
  });
</script>

<Modal on:close modalType="error">
  <div class="grid grid-cols-[1fr_3fr] max-w-[100vw]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center max-md:text-4xl lg:text-8xl"
      {icon}
    />
    <h1 class="font-bold max-md:text-xl lg:text-2xl">
      {error.status ?? 500} - {error.cause ?? $t('error.cause.fallback')}
    </h1>
    {#if error.message && brokenUpMessage.length}
      <div>
        {#each brokenUpMessage as portion}
          {#if portion.includes('/') && portion.includes(':')}
            <time class="first-letter:uppercase">
              {$date(new Date(portion.toString().endsWith('Z') ? portion : `${portion}Z`), {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </time>
          {:else}
            <p>{portion}</p>
          {/if}
        {/each}
      </div>
    {:else if error.message}
      <p>{error.message}</p>
    {/if}
  </div>
  <div class="modal-action">
    <Button on:click={() => dispatch('close')}>Ok</Button>
  </div>
</Modal>
