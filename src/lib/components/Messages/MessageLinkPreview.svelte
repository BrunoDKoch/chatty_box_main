<script lang="ts">
  import { ofetch } from 'ofetch';
  import { onMount } from 'svelte';
  import ImageModal from '$lib/components/Modals/ImageModal.svelte';
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import { getLinkType } from '$lib/useLinkCheck';
  import Button from '$lib/components/Custom/Button.svelte';
  export let link: string;
  let showImageModal = false;
  $: linkType = getLinkType(link);
</script>

{#if linkType === 'YouTube'}
  <iframe
    src={link.replace('watch?v=', 'embed/')}
    frameborder="0"
    class="lg:w-[560px] lg:h-[315px] max-md:w-[100%] max-md:h-[100%]"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  />
{:else if linkType === 'image'}
  <Button format="ghost" on:click={() => (showImageModal = !showImageModal)}>
    <img
      class="max-w-52 max-h-52"
      src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL}/${link}?width=200` : link}
      alt=""
    />
  </Button>
{:else if linkType === 'video'}
  <video controls>
    <track kind="captions" />
    <source src={link.startsWith('static/video') ? `${PUBLIC_IMAGES_URL}/${link}` : link} type="video/{link.split('.').pop()}" />
  </video>
{:else if linkType === 'audio'}
  <audio controls src={link.startsWith('static/audio') ? `${PUBLIC_IMAGES_URL}/${link}` : link}></audio>
{:else}
  <a class="link" rel="external" href={link}>{link}</a>
{/if}

{#if showImageModal}
  <ImageModal on:close={() => (showImageModal = !showImageModal)} {link} />
{/if}
