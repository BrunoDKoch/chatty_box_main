<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV as baseURL } from '$env/static/public';
  import CloseButton from '$lib/components/Custom/CloseButton.svelte';
  import useFileInfo, { type FileType } from '$lib/useFileInfo';
  import { getLinkType } from '$lib/useLinkCheck';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let file: string;
  export let index: number;
  const fileInfo = getFileInfo();
  const dispatch = createEventDispatcher();

  function getIcon(linkType: ReturnType<typeof getLinkType>) {
    switch (linkType) {
      case 'video':
        return 'mdi:video';
      case 'audio':
        return 'mdi:music';
      default:
        return 'mdi:image';
    }
  }
  function getFileInfo(): {
    fileName?: string;
    extension?: string;
    fileType: FileType | ReturnType<typeof getLinkType>;
    icon: string;
  } {
    const linkType = getLinkType(file);
    if (linkType && linkType !== 'file')
      return {
        fileName: file.split('/').pop()!,
        extension: file.split('.').pop()!,
        fileType: linkType as any,
        icon: getIcon(linkType),
      };
    return useFileInfo(file);
  }
</script>

<div transition:fly={{ y: 1000, duration: 200, opacity: 0 }} class="w-52 flex flex-col relative items-center">
  <div class="w-full absolute z-50">
    <CloseButton on:close={() => dispatch('removeFile', file)} id="remove-file-{index + 1}" />
  </div>
  <figure class="z-0">
    {#if fileInfo.fileType === 'image'}
      <img
        on:error={(e) => console.error(e)}
        class="relative"
        crossorigin="use-credentials"
        decoding="async"
        src="{baseURL}/{file}?width=250"
        alt=""
      />
    {:else}
      <div class="flex bg-base-100 items-center justify-center flex-col h-52 w-52 rounded-xl px-10">
        <iconify-icon class="text-5xl" icon={fileInfo.icon} />
        <p class="break-words overflow-hidden w-52 px-1 box-border italic font-semibold">{fileInfo.fileName}</p>
      </div>
    {/if}
  </figure>
</div>
