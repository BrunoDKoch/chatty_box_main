<script lang="ts">
  import { locale, t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import TitleAndIcon from './Titles/TitleAndIcon.svelte';
  import Button from '../Custom/Button.svelte';
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
    <Button id="yes" joinItem buttonUIType="success" on:click={() => dispatch('confirm')}>
      {$t('common.yes')}
    </Button>
    <Button id="no" joinItem buttonUIType="error" on:click={() => dispatch('deny')}>
      {$t('common.no')}
    </Button>
  </div>
</Modal>
