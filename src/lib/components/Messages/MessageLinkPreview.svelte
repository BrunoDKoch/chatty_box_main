<script lang="ts">
  import { getLinkType } from '$lib/useLinkCheck';
  import FileMessage from './LinkTypes/FileMessage.svelte';
  import VideoMessage from './LinkTypes/VideoMessage.svelte';
  import AudioMessage from './LinkTypes/AudioMessage.svelte';
  import ImageMessage from './LinkTypes/ImageMessage.svelte';
  import ExternalLinkMessage from './LinkTypes/ExternalLinkMessage.svelte';
  import YouTubeMessage from './LinkTypes/YouTubeMessage.svelte';
  export let link: string;
  export let index: number;
  export let total: number;

  $: linkType = getLinkType(link);

  function getGridSpan() {
    switch (total) {
      case 1:
        return 'lg:col-span-2 row-span-4 lg:row-span-2';
      case 2:
        return 'row-span-2';
      case 3:
        if (index === 3) return 'lg:col-span-2';
      default:
        return '';
    }
  }
</script>

<div class="{getGridSpan()} flex items-center max-lg:w-48 justify-center border-dotted" class:border-2={linkType === 'file'}>
  {#if linkType === 'YouTube'}
    <YouTubeMessage {link} />
  {:else if linkType === 'image'}
    <ImageMessage {link} on:showImage />
  {:else if linkType === 'video'}
    <VideoMessage {link} />
  {:else if linkType === 'audio'}
    <AudioMessage {link} />
  {:else if linkType === 'file'}
    <FileMessage {link} on:fileClick />
  {:else}
    <ExternalLinkMessage {link} on:showExternalLink />
  {/if}
</div>
