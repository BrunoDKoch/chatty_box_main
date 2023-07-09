<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';

  export let link: string;
</script>

<audio
  class="relative max-lg:w-52"
  controls
  src={link.startsWith('static/audio') ? `${PUBLIC_IMAGES_URL_DEV}/${link}` : link}
/>
