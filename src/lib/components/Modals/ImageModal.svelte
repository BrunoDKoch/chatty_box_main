<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import Modal from '$lib/components/Modals/Modal.svelte';
  export let link: string;
</script>

<Modal additionalClasses="min-w-fit" on:close>
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
