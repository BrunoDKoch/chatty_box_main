<script lang="ts">
  import DragNDrop from '$lib/components/Custom/DragNDrop.svelte';
  import { createEventDispatcher } from 'svelte';
  $: uploadSuccessful = false;
  $: uploading = false;
  const dispatch = createEventDispatcher();
</script>

<dialog class="modal w-screen h-screen modal-open">
  <div class="modal-box">
    <div class="flex justify-end">
      <button on:click={() => dispatch('close')} class="btn btn-sm btn-circle">
        <iconify-icon icon="mdi:close" />
      </button>
    </div>
    <DragNDrop {uploading} {uploadSuccessful} />
  </div>
</dialog>
