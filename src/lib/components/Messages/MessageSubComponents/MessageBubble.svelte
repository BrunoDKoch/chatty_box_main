<script lang="ts">
  import { hostedFilesRegex, urlRegex } from '$lib/useLinkCheck';
  import { t } from 'svelte-i18n';
  import MessageLinkPreview from '../MessageLinkPreview.svelte';
  import { onMount } from 'svelte';

  export let text: string;
  export let isFromCaller: boolean;
  export let msgError = false;

  // Handling links
  $: links = messageContainsLink();
  function messageContainsLink() {
    const linksFound = text.match(urlRegex)?.length
      ? text.match(urlRegex)
      : text.match(hostedFilesRegex);
    if (!linksFound) return;
    return linksFound;
  }
  $: links, (text = text.replaceAll(urlRegex, '')), (text = text.replaceAll(hostedFilesRegex, ''));
</script>

<div
  class="chat-bubble {text === 'messageFlagged' ? 'opacity-50 italic' : 'opacity-100'} {isFromCaller
    ? 'chat-bubble-success'
    : 'chat-bubble-info'}"
  class:chat-bubble-error={msgError}
>
  <div class="flex flex-col">
    {#if text === 'messageFlagged'}
      {$t(text)}
    {:else if links && links.length}
    <div class="grid grid-flow-row grid-cols-[minmax(50%,_1fr)_auto] grid-rows-[minmax(50%,_1fr)_auto] rounded-lg place-items-center items-center justify-center">
      {#each links as link}
        <MessageLinkPreview on:fileClick on:showImage on:showExternalLink bind:link />
      {/each}
    </div>
      {#if text}
        <div class="divider before:bg-black after:bg-black" />
      {/if}
    {/if}
    {text}
  </div>
</div>
