<script lang="ts">
  import DragNDrop from '../Custom/DragNDrop.svelte';
  import Modal from './Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  $: uploadSuccessful = false;
  $: uploading = false;
  const dispatch = createEventDispatcher();
</script>

<Modal on:close>
  <DragNDrop on:updateFile={() => dispatch('close')} {uploading} {uploadSuccessful} />
</Modal>
