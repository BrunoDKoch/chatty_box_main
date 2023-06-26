<script lang="ts">
  import { PUBLIC_AUTH_URL_DEV } from '$env/static/public';
  import DragNDrop from '$lib/components/Custom/DragNDrop.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import { ofetch } from 'ofetch';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  $: uploadSuccessful = false;
  $: uploading = false;
  const dispatch = createEventDispatcher();
  async function handleCancellation() {
    await ofetch('/avatar', {
      baseURL: PUBLIC_AUTH_URL_DEV,
      credentials: 'include',
      method: 'DELETE',
      mode: 'cors',
    });
    dispatch('updateFile', null);
  }
</script>

<Modal on:close>
  <DragNDrop isAvatar on:updateFile {uploading} {uploadSuccessful} />
  <div class="modal-action">
    <div class="join">
      <Button id="cancel" joinItem buttonUIType="error" on:click={async () => await handleCancellation()}>
        {$t('common.cancel')}
      </Button>
      <Button id="ok" joinItem buttonUIType="success" on:click={() => dispatch('close')}>OK</Button>
    </div>
  </div>
</Modal>
