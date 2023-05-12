<script lang="ts">
  import { ofetch } from 'ofetch';
  import { onMount } from 'svelte';
  import ImageModal from './ImageModal.svelte';
  export let link: string;
  let showImageModal = false;
  function isImageLink() {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = link.split('.').pop();
    if (!extension) return;
    return imageExtensions.includes(extension.toLowerCase());
  }
  function isVideoLink() {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = link.split('.').pop();
    if (!extension) return;
    return videoExtensions.includes(extension.toLowerCase());
  }
</script>

{#if isImageLink()}
  <button on:click={() => (showImageModal = !showImageModal)}>
    <img class="max-w-52 max-h-52" src={link} alt="" />
  </button>
{:else if isVideoLink()}
  <video controls>
    <track kind="captions">
      <source src={link} type="video/{link.split('.').pop()}" >
  </video>
{:else}
  <a class="link" rel="external" href={link}>{link}</a>
{/if}

{#if showImageModal}
  <ImageModal on:close={() => (showImageModal = !showImageModal)} {link} />
{/if}
