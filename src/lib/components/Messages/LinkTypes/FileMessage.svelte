<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV } from '$env/static/public';
  import { t } from 'svelte-i18n';
  import useFileInfo from '$lib/useFileInfo';
  import { createEventDispatcher } from 'svelte';

  export let link: string;
  const dispatch = createEventDispatcher();
  const { fileName, icon } = useFileInfo(link);
</script>

<a
  class="border-dotted border-base-100 border-2 w-52 h-28"
  on:click|preventDefault={() => dispatch('fileClick', link)}
  href="{PUBLIC_IMAGES_URL_DEV}/{link}"
>
  <div class="items-center place-items-center h-full w-fit hover:link p-4 grid grid-cols-5">
    <iconify-icon class="text-3xl lg:text-4xl grayscale" {icon} />
    <div class="flex col-span-4 flex-col">
      <span class="italic font-bold">{fileName}</span>
      <div class="flex items-center gap-2">
        <iconify-icon icon="mdi:download" />
        <p class="capitalize">{$t('common.download')}</p>
      </div>
    </div>
  </div>
</a>
