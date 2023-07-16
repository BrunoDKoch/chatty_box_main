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
  class="w-52 h-auto"
  on:click|preventDefault={() => dispatch('fileClick', link)}
  href="{PUBLIC_IMAGES_URL_DEV}/{link}"
>
  <div class="flex flex-col items-center overflow-hidden">
    <iconify-icon class="text-3xl lg:text-4xl grayscale" {icon} />
    <div class="flex col-span-4 flex-col overflow-hidden text-center items-center">
      <span class="italic break-words overflow-hidden w-52 px-1 box-border font-bold">{fileName}</span>
      <div class="flex items-center gap-2">
        <iconify-icon icon="mdi:download" />
        <p class="capitalize">{$t('common.download')}</p>
      </div>
    </div>
  </div>
</a>
