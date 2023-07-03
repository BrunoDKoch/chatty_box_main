<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import { t } from 'svelte-i18n';
  import useFileInfo from '$lib/useFileInfo';
  import { createEventDispatcher } from 'svelte';

  export let link: string;
  const dispatch = createEventDispatcher();
  const { fileName, icon } = useFileInfo(link);
</script>

<a on:click|preventDefault={() => dispatch('fileClick', link)} href="{PUBLIC_IMAGES_URL}/{link}">
  <div class="items-center hover:link p-4 grid grid-cols-5">
    <iconify-icon class="text-4xl grayscale" {icon} />
    <div class="flex col-span-4 flex-col">
      <p class="italic font-bold">{fileName}</p>
      <div class="flex items-center gap-2">
        <iconify-icon icon="mdi:download" />
        <p class="capitalize">{$t('common.download')}</p>
      </div>
    </div>
  </div>
</a>
