<script lang="ts">
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import Modal from '$lib/components/Modal.svelte';
  export let link: string;
</script>

<Modal>
  <CloseButton on:close />
  <div class="flex items-center justify-center">
    <img class="max-h-[70vh] max-w-[70vw]" src={link} alt="" />
  </div>
  <div class="modal-action">
    <a rel="external" target="_blank" href={link} class="btn">View original</a>
  </div>
</Modal>
