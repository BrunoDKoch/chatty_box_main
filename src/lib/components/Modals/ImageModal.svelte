<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import Image from '../Custom/Image.svelte';
  export let link: string;
</script>

<Modal additionalClasses="min-w-fit" on:close>
  <div class="flex items-center justify-center">
    <Image
      additionalClasses="max-h-[70dvh] max-w-[70dvw]"
      src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL_DEV}/${link}?width=600` : link}
      alt=""
    />
  </div>
  <div class="modal-action">
    <a
      rel="external"
      target="_blank"
      href={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL_DEV}/${link}` : link}
      class="btn">View original</a
    >
  </div>
</Modal>
