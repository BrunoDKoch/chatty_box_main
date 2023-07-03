<script lang="ts">
  import { locale, t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import TitleAndIcon from './Titles/TitleAndIcon.svelte';
  import type { FileType } from '../../useFileInfo';
  import useFileInfo from '../../useFileInfo';
  import { toKebabCase } from '$lib/useCaseConversion';
  import Button from '../Custom/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import { PUBLIC_IMAGES_URL as baseURL } from '$env/static/public';
  import { ofetch } from 'ofetch';
  export let link: string;
  const dispatch = createEventDispatcher();
  const { fileType, icon, fileName } = useFileInfo(link);
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const showWarning = fileType === 'executable' || fileType === 'compressed';
  const modalType = showWarning ? 'warning' : 'base';
  const titleAndIcon = getTitleIconCombo();
  function getTitleIconCombo() {
    if (!showWarning)
      return {
        title: `${$locale === 'es' ? '¿' : ''}${$t('common.areYouSure')}?`,
        icon: 'mdi:chat-question',
      };
    return {
      title: $t('common.warning'),
      icon: 'material-symbols:warning',
    };
  }
</script>

<Modal {modalType} on:close>
  <TitleAndIcon title={titleAndIcon.title} icon={titleAndIcon.icon} />
  <div class="modal-middle">
    <p>{$t('file.aboutToDownload')}</p>
    <div class="items-center flex justify-center gap-3">
      <iconify-icon class="text-4xl grayscale" {icon} />
      <p class="italic font-bold">{fileName}</p>
    </div>
    <p class="first-letter:uppercase">
      {$t(`file.thisIs.${vowels.includes(fileType[0]) ? 'an' : 'a'}`, {
        values: { item: $t(`file.fileType.${fileType}`) },
      })}
    </p>
    {#if showWarning}
      <strong>
        <p class="font-bold first-letter:uppercase">
          {$t(`file.${fileType}Warning`)}
        </p>
      </strong>
    {/if}
    <div class="divider" />
  </div>
  <div class="modal-bottom text-end">
    <p class="capitalize">
      {$locale === 'es' ? '¿' : ''}{$t('common.download')}
      {$t('common.file')}?
    </p>
    <div class="modal-action">
      <div class="join">
        <Button
          link="{baseURL}/{link}"
          on:click={() => dispatch('close')}
          buttonUIType={showWarning ? 'warning' : 'info'}
          joinItem
          id="yes"
        >
          {$t('common.yes')}
        </Button>
        <Button buttonUIType="info" on:click={() => dispatch('close')} joinItem id="no">
          {$t('common.no')}
        </Button>
      </div>
    </div>
  </div>
</Modal>
