<script lang="ts">
  import { getLinkType, hostedFilesRegex, urlRegex } from '$lib/useLinkCheck';
  import { t } from 'svelte-i18n';
  import MessageLinkPreview from '../MessageLinkPreview.svelte';
  import ExternalLinkMessage from '../LinkTypes/ExternalLinkMessage.svelte';

  export let text: string;
  export let isFromCaller: boolean;
  export let msgError = false;

  $: splitText = text.split(' ');

  // Handling links
  $: fileLinks = messageContainsFileLink();
  $: simpleLinks = text.match(urlRegex) ?? ([] as string[]);

  function messageContainsFileLink() {
    const linksFound = text.match(urlRegex)?.length
      ? text.match(urlRegex)
      : text.match(hostedFilesRegex);
    if (!linksFound) return;
    return linksFound.filter((link) => getLinkType(link));
  }
  $: fileLinks,
    (text = text.replaceAll(hostedFilesRegex, '')),
    (splitText = text.split(' ')),
    (simpleLinks = text.match(urlRegex) ?? []);
</script>

<div
  class="chat-bubble container {text === 'messageFlagged'
    ? 'opacity-50 italic'
    : 'opacity-100'} {isFromCaller ? 'chat-bubble-success' : 'chat-bubble-info'}"
  class:chat-bubble-error={msgError}
>
  <div class="flex flex-col">
    {#if text === 'messageFlagged'}
      {$t(text)}
    {:else if fileLinks && fileLinks.length}
      <div
        class="grid grid-flow-row lg:grid-cols-2 max-lg:grid-rows-{fileLinks.length} lg:grid-rows-2 rounded-lg w-52 max-w-52 lg:w-96 lg:max-w-96"
      >
        {#each fileLinks as link (fileLinks.indexOf(link))}
          <MessageLinkPreview
            total={fileLinks.length}
            index={fileLinks.indexOf(link) + 1}
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
    <p>
      {#each splitText as word}
        {#if simpleLinks.includes(word)}
          <ExternalLinkMessage on:showExternalLink link={word} />
        {:else}
          {splitText.indexOf(word) === splitText.length + 1 ? word : word + ' '}
        {/if}
      {/each}
    </p>
  </div>
</div>
