<script lang="ts">
  import DragNDrop from '$lib/components/Custom/DragNDrop.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  $: uploadSuccessful = false;
  $: uploading = false;
  const dispatch = createEventDispatcher();
</script>

<Modal>
  <div class="flex justify-end">
    <button on:click={() => dispatch('close')} class="btn btn-sm btn-circle">
      <iconify-icon icon="mdi:close" />
    </button>
  </div>
  <DragNDrop {uploading} {uploadSuccessful} />
</Modal>
