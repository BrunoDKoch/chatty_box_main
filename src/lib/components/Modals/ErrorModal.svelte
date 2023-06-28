<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import { date, t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  import { getIcon } from '$lib/useError';

  export let error: App.Error;
  $: icon = getIcon(error.status);
  const dispatch = createEventDispatcher();

  let brokenUpMessage = [] as string[];
  onMount(() => {
    if (error.message && error.message.includes('\n')) {
      brokenUpMessage = error.message.split('\n');
    }
  });
</script>

<Modal on:close modalType="error">
  <div class="grid grid-cols-[1fr_3fr] max-w-[100vw]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center max-lg:text-4xl lg:text-8xl"
      {icon}
    />
    <h1 class="font-bold max-lg:text-xl lg:text-2xl">
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
    <Button id="ok" on:click={() => dispatch('close')}>Ok</Button>
  </div>
</Modal>
