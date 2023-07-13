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
  class="chat-bubble container {text === 'messageFlagged' ? 'opacity-50 italic' : 'opacity-100'} {isFromCaller
    ? 'chat-bubble-success'
    : 'chat-bubble-info'}"
  class:chat-bubble-error={msgError}
>
  <div class="flex flex-col">
    {#if text === 'messageFlagged'}
      {$t(text)}
    {:else if links && links.length}
      <div
        class="grid grid-flow-row lg:grid-cols-2 max-lg:grid-rows-[{links.length}] lg:grid-rows-2 rounded-lg w-52 max-w-52 lg:w-96 lg:max-w-96"
      >
        {#each links as link (links.indexOf(link))}
          <MessageLinkPreview
            total={links.length}
            index={links.indexOf(link) + 1}
            on:fileClick
            on:showImage
            on:showExternalLink
            bind:link
          />
        {/each}
      </div>
      {#if text}
        <div class="divider before:bg-black after:bg-black" />
      {/if}
    {/if}
    {text}
  </div>
</div>
