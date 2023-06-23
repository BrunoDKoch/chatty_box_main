<script lang="ts">
  import { PUBLIC_AUTH_URL_DEV } from '$env/static/public';
  import { chatId } from '$lib/useActiveChat';
    import useError from '$lib/useError';
  import Dropzone from 'dropzone';
  import { ofetch } from 'ofetch';
  import { createEventDispatcher, onMount } from 'svelte';
  import { t } from 'svelte-i18n';

  export let uploadSuccessful: boolean;
  export let uploading: boolean;
  export let isAvatar = false;

  let preview: HTMLImageElement;
  let fileName: HTMLElement;
  let showPreview = false;
  let fileType = '';
  let loadingContainer: HTMLElement;
  let progressElement: HTMLProgressElement;
  let uploadPercentage: number;

  let previewIcon: HTMLElement;

  // Use new variable to show checkmark, and then hide loading contents
  let showCheck = false;

  $: icon = 'mdi:upload';
  $: showPreview, setPreviewIconHidden();
  $: showPreview, (icon = 'mdi:upload');
  const dispatch = createEventDispatcher();

  // If it's an avatar, only accept one image
  const settingsObject = isAvatar
    ? {
        acceptedFiles: 'image/*',
        parallelUploads: 1,
        url: `${PUBLIC_AUTH_URL_DEV}/User/Avatar`,
      }
    : {
        acceptedFiles: 'image/*',
        parallelUploads: 4,
        url: `${PUBLIC_AUTH_URL_DEV}/User/Upload/${$chatId}`,
      };

  const { acceptedFiles, parallelUploads, url } = settingsObject;
  let dropzone: Dropzone;

  $: {
    if (dropzone && uploadSuccessful) {
      dropzone.removeAllFiles();
    }
  }

  function setPreviewIconHidden() {
    if (!previewIcon) return;
    if (showPreview && previewIcon.classList.contains('relative')) {
      previewIcon.classList.replace('relative', 'hidden');
      return;
    }
    if (!showPreview && previewIcon.classList.contains('hidden')) {
      previewIcon.classList.replace('hidden', 'relative');
    }
  }

  onMount(() => {
    dropzone = new Dropzone('form#file-drop', {
      // NOTE: might need to change url
      url,
      clickable: true,
      previewTemplate: document.getElementById('preview-template')!.innerHTML,
      parallelUploads,
      acceptedFiles,
      maxFilesize: 20,
      withCredentials: true,
      dictFileTooBig: $t('files.tooBig'),
      filesizeBase: 1000,
      thumbnailHeight: 800,
      dictDefaultMessage: $t('files.dragHere'),
      thumbnailWidth: 800,
      thumbnailMethod: 'contain',
      maxFiles: parallelUploads,
      dictCancelUpload: `${$t('common.cancel')} ${$t('common.upload')}`,
      dictRemoveFile: $t('common.remove', { values: { item: $t('common.image') } }),

      accept(file, done) {
        if (file) {
          showPreview = true;
          fileType = file.type;
          done();
        }
      },

      uploadprogress(file, progress, bytesSent) {
        fileName.innerText = file.name;
        if (progress < 100) {
          uploading = true;
          showCheck = true;
        }
        uploadPercentage = Math.round(progress);
        progressElement.value = uploadPercentage;
        progressElement.innerText = `${uploadPercentage}%`;
      },
      thumbnail(file, dataUrl) {
        showPreview = true;
        preview.src = dataUrl;
        preview.alt = file.name;
      },
      async removedfile(file) {
        showPreview = false;
        uploading = false;
        preview.src = '';
        preview.alt = '';
        fileName.innerHTML = '';
        dispatch('updateFile', null);

        file.previewTemplate.removeChild(document.getElementsByClassName('dz-remove')[0]);
      },
      addRemoveLinks: true,
      uploadMultiple: false,
      ignoreHiddenFiles: true,
      hiddenInputContainer: document.getElementById('drop-container')!,
      init() {
        this.on('error', (file, message) => {
          $useError = {
            status: 500,
            cause: $t('error.cause.500'),
            message: message as string,
          }
          if (!file.accepted) this.removeFile(file);
          showCheck = false;
          uploading = false;
          showPreview = false;
          document.getElementById('img-container')!.classList.replace('flex', 'hidden');
        });
        this.on('addedfile', (file) => {
          document.getElementById('img-container')!.classList.replace('hidden', 'flex');
          if (!preview.classList.contains('opacity-10')) preview.classList.add('opacity-10');
          if (document.getElementsByClassName('dz-remove').length > 1) {
            this.previewsContainer.removeChild(this.previewsContainer.lastChild!);
          }
          this.files = [file];
        });
        this.on('success', (file) => {
          uploading = false;
          if (!showCheck) showCheck = true;
          dispatch('updateFile', file.name);
          setTimeout(() => {
            showCheck = false;
            if (preview.classList.contains('opacity-10')) preview.classList.remove('opacity-10');
          }, 2000);
        });
      },
    });
  });
</script>

<div
  class="flex p-2 items-center justify-center border border-dashed bg-slate-300 dark:bg-slate-900 hover:dark:bg-slate-700 hover:bg-slate-500"
  id="drop-container"
>
  <form class="dropzone w-[50vw] items-center justify-center flex flex-col" id="file-drop">
    <div
      on:click={() => dropzone.hiddenFileInput?.click()}
      on:keypress={() => dropzone.hiddenFileInput?.click()}
      class="flex flex-col items-center justify-center"
    >
      <iconify-icon class="relative" bind:this={previewIcon} {icon} height="10rem" />
    </div>
    <div id="preview-template" class="flex justify-center items-center flex-col gap-2">
      <div class="dz-preview dz-file-preview text-lg font-semibold" />

      <figure id="img-container" class="hidden items-center m-auto justify-center">
        <div
          bind:this={loadingContainer}
          class="flex-col gap-3 opacity-100 {uploading
            ? 'flex'
            : 'hidden'} absolute w-[800px] h-[800px] items-center justify-center"
        >
          <div class="flex flex-col gap-3">
            <iconify-icon icon="svg-spinners:6-dots-scale" />
            <progress
              bind:this={progressElement}
              class="progress progress-error {uploading
                ? 'relative'
                : 'hidden'} dark:progress-warning w-80"
              value="0"
              max="100"
            />
          </div>
          <p class="font-semibold">{uploadPercentage}% completo</p>
        </div>
        <img class="dz-image-preview" bind:this={preview} src="" alt="" />
      </figure>
      <div class="dz-filename" bind:this={fileName} />
      <div class="dz-error-message"><span data-dz-errormessage="" /></div>
    </div>
  </form>
</div>
