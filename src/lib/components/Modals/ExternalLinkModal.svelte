<script lang="ts">
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import Button from '../Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import TitleAndIcon from './Titles/TitleAndIcon.svelte';
  export let link: string;
  const dispatch = createEventDispatcher();
</script>

<Modal modalType="warning" on:close>
  <TitleAndIcon title={$t('common.externalLink')} icon="material-symbols:warning" />
  <p>{$t('common.thisIsAnExternalLink', { values: { item: link } })}</p>
  <div class="modal-action join">
    <Button joinItem target="_blank" {link} id="yes">{$t('common.yes')}</Button>
    <Button joinItem id="no" on:click={() => dispatch('close')}>{$t('common.no')}</Button>
  </div>
</Modal>
