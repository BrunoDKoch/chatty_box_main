<script lang="ts">
  import { PUBLIC_AUTH_URL_DEV, PUBLIC_IMAGES_URL } from '$env/static/public';
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  export let link: string;
</script>

<Modal>
  <CloseButton on:close />
  <div class="flex items-center justify-center">
    <img
      class="max-h-[70vh] max-w-[70vw]"
      src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL}/${link}?width=600` : link}
      alt=""
    />
  </div>
  <div class="modal-action">
    <a
      rel="external"
      target="_blank"
      href={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL}/${link}` : link}
      class="btn">View original</a
    >
  </div>
</Modal>
