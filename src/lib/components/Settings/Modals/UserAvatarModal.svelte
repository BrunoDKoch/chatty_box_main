<script lang="ts">
  import { PUBLIC_AUTH_URL_DEV } from '$env/static/public';
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import DragNDrop from '$lib/components/Custom/DragNDrop.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import { ofetch } from 'ofetch';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
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

<Modal>
  <CloseButton on:close />
  <DragNDrop isAvatar on:updateFile {uploading} {uploadSuccessful} />
  <div class="modal-action">
    <div class="btn-group">
      <button on:click={async () => await handleCancellation()} class="btn btn-error"
        >{$t('common.cancel')}</button
      >
      <button on:click={() => dispatch('close')} class="btn btn-success">OK</button>
    </div>
  </div>
</Modal>
