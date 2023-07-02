<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import { getLinkType } from '$lib/useLinkCheck';
  import Button from '$lib/components/Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import MessageFilePreview from './MessageFilePreview.svelte';
  export let link: string;

  const dispatch = createEventDispatcher();

  let showImageModal = false;
  $: linkType = getLinkType(link);
</script>

{#if linkType === 'YouTube'}
  <iframe
    src={link.replace('watch?v=', 'embed/')}
    frameborder="0"
    class="lg:w-[560px] lg:h-[315px] max-lg:w-[100%] max-lg:h-[100%]"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  />
{:else if linkType === 'image'}
  <Button
    id={link}
    format="ghost"
    additionalClasses="h-52"
    on:click={() => dispatch('showImage', link)}
  >
    <img
      class="max-w-52 max-h-52"
      src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL}/${link}?width=200` : link}
      alt=""
    />
  </Button>
{:else if linkType === 'video'}
  <video controls>
    <track kind="captions" />
    <source
      src={link.startsWith('static/video') ? `${PUBLIC_IMAGES_URL}/${link}` : link}
      type="video/{link.split('.').pop()}"
    />
  </video>
{:else if linkType === 'audio'}
  <audio
    class="relative max-lg:w-52"
    controls
    src={link.startsWith('static/audio') ? `${PUBLIC_IMAGES_URL}/${link}` : link}
  />
{:else if linkType === 'file'}
  <MessageFilePreview {link} />
{:else}
  <a
    on:click|preventDefault={() => dispatch('showExternalLink', link)}
    on:touchstart|preventDefault={() => dispatch('showExternalLink', link)}
    class="link"
    rel="external"
    href={link}>{link}</a
  >
{/if}
