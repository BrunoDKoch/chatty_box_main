<script lang="ts">
  export let link: string;
</script>

<iframe
  src={link.replace('watch?v=', 'embed/')}
  frameborder="0"
  class="lg:w-[560px] lg:h-[315px] max-lg:w-[100%] max-lg:h-[100%]"
  title="YouTube video player"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
/>
