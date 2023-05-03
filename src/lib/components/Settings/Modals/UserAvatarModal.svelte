<script lang="ts">
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import DragNDrop from '$lib/components/Custom/DragNDrop.svelte';
  import Modal from '$lib/components/Modal.svelte';
  $: uploadSuccessful = false;
  $: uploading = false;
</script>

<Modal>
  <CloseButton on:close />
  <DragNDrop {uploading} {uploadSuccessful} />
</Modal>
