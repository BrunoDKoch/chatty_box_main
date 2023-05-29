<script lang="ts">
  import { locale, t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  export let action: string;
  const dispatch = createEventDispatcher();
</script>

<Modal>
  <div class="grid grid-cols-[1fr_3fr] max-w-[100vw]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center"
      icon="mdi:chat-question"
      height="5rem"
    />
    <h1 class="font-bold uppercase text-2xl">
      {$locale === 'es' ? '¿' : ''}
      {$t('common.areYouSure')}?
    </h1>
  </div>
  <div class="modal-middle">
    <p>
      {#if $locale === 'es'}
        <span>¿</span>
      {/if}
      <span class="first-letter:uppercase">
        {$t('common.areYouSure')}
        {$t('common.wishTo', { values: { item: action } })}?
      </span>
    </p>
  </div>
  <div class="modal-action btn-group">
    <button class="btn btn-success" on:click={() => dispatch('confirm')}>{$t('common.yes')}</button>
    <button class="btn btn-error" on:click={() => dispatch('deny')}>{$t('common.no')}</button>
  </div>
</Modal>
