<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';

  export let link: string;
</script>

<video class="max-w-[200px] max-h-[120px]" controls>
  <track kind="captions" />
  <source
    src={link.startsWith('static/video') ? `${PUBLIC_IMAGES_URL_DEV}/${link}` : link}
    type="video/{link.split('.').pop()}"
  />
</video>
