<script lang="ts">
  import { ofetch } from 'ofetch';
  import { onMount } from 'svelte';
  import ImageModal from './ImageModal.svelte';
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import { getLinkType } from '$lib/useLinkCheck';
  export let link: string;
  let showImageModal = false;
  let innerWidth: number;
  $: linkType = getLinkType(link);
</script>

<svelte:window bind:innerWidth />

{#if linkType === 'YouTube'}
  <iframe
    src={link.replace('watch?v=', 'embed/')}
    frameborder="0"
    width={innerWidth >= 1024 ? 560 : 250}
    height={innerWidth >= 1024 ? 315 : 135}
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  />
{:else if linkType === 'image'}
  <button on:click={() => (showImageModal = !showImageModal)}>
    <img
      class="max-w-52 max-h-52"
      src={link.startsWith('static/images') ? `${PUBLIC_IMAGES_URL}/${link}?width=200` : link}
      alt=""
    />
  </button>
{:else if linkType === 'video'}
  <video controls>
    <track kind="captions" />
    <source src={link} type="video/{link.split('.').pop()}" />
  </video>
{:else}
  <a class="link" rel="external" href={link}>{link}</a>
{/if}

{#if showImageModal}
  <ImageModal on:close={() => (showImageModal = !showImageModal)} {link} />
{/if}
