<script lang="ts">
  import { getLinkType } from '$lib/useLinkCheck';
  import FileMessage from './LinkTypes/FileMessage.svelte';
  import VideoMessage from './LinkTypes/VideoMessage.svelte';
  import AudioMessage from './LinkTypes/AudioMessage.svelte';
  import ImageMessage from './LinkTypes/ImageMessage.svelte';
  import ExternalLinkMessage from './LinkTypes/ExternalLinkMessage.svelte';
  import YouTubeMessage from './LinkTypes/YouTubeMessage.svelte';
  export let link: string;

  $: linkType = getLinkType(link);
</script>

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
