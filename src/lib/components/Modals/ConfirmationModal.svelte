<script lang="ts">
  import { locale, t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import TitleAndIcon from './Titles/TitleAndIcon.svelte';
  export let action: string;
  const dispatch = createEventDispatcher();
</script>

<Modal on:close>
  <TitleAndIcon
    title="{$locale === 'es' ? '¿' : ''}
    {$t('common.areYouSure')}?"
    icon="mdi:chat-question"
  />
  <div class="modal-middle">
    <p>
      {#if $locale === 'es'}
        <span>¿</span>
      {/if}
      <span class="first-letter:uppercase">
        {$t('common.areYouSure').charAt(0).toUpperCase()}{$t('common.areYouSure').slice(1)}
        {$t('common.wishTo', { values: { item: action } })}?
      </span>
    </p>
  </div>
  <div class="modal-action join">
    <button class="btn join-item btn-success" on:click={() => dispatch('confirm')}
      >{$t('common.yes')}</button
    >
    <button class="btn join-item btn-error" on:click={() => dispatch('deny')}
      >{$t('common.no')}</button
    >
  </div>
</Modal>
