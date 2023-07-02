<script lang="ts">
  import { PUBLIC_AUTH_URL_DEV } from '$env/static/public';
  import { chatId } from '$lib/useActiveChat';
  import useError from '$lib/useError';
  import Dropzone from 'dropzone';
  import { createEventDispatcher, onMount } from 'svelte';
  import { t } from 'svelte-i18n';

  export let uploadSuccessful: boolean;
  export let uploading: boolean;
  export let isAvatar = false;
  export let wrapperClass = '';

  $: {
    if (
      document.getElementsByClassName('dz-default') &&
      document.getElementsByClassName('dz-default').length
    ) {
      document.getElementsByClassName('dz-default')[0].classList.add('hidden');
    }
  }

  // If it's an avatar, only accept one image
  const settingsObject = isAvatar
    ? {
        acceptedFiles: 'image/*',
        parallelUploads: 1,
        url: `${PUBLIC_AUTH_URL_DEV}/User/Avatar`,
      }
    : {
        acceptedFiles: 'image/*,audio/*,video/*',
        parallelUploads: 4,
        url: `${PUBLIC_AUTH_URL_DEV}/User/Upload/${$chatId}`,
      };

  const { acceptedFiles, parallelUploads, url } = settingsObject;

  // HTML Elements
  let preview: HTMLImageElement;
  let fileName: HTMLElement;
  let showPreview = false;
  let fileType = '';
  let loadingContainer: HTMLElement;
  let progressElement: HTMLProgressElement;
  let dropContainer: HTMLElement;
  let fileDrop: HTMLFormElement;
  let dropIconWrapper: HTMLElement;
  let uploadPercentage: number;

  // Use new variable to show checkmark, and then hide loading contents
  let showCheck = false;

  const dispatch = createEventDispatcher();

  let dropzone: Dropzone;

  $: {
    if (dropzone && uploadSuccessful) {
      dropzone.removeAllFiles();
    }
  }

  // Handle drop icon
  let dropIcon: HTMLElement;
  function setShowDropIcon(option: 'show' | 'hide') {
    if (option === 'hide') return dropIcon.classList.replace('hidden', 'flex-col');
    return dropIcon.className.replace('flex-col', 'hidden');
  }

  onMount(() => {
    dropzone = new Dropzone('form#file-drop', {
      // NOTE: might need to change url
      url,
      clickable: document.getElementById('file-input-toggle')!,
      previewTemplate: document.getElementById('preview-template')!.innerHTML,
      parallelUploads,
      acceptedFiles,
      dictDefaultMessage: '',
      dictFallbackMessage: '',
      maxFilesize: 20,
      withCredentials: true,
      dictFileTooBig: $t('files.tooBig'),
      filesizeBase: 1000,
      thumbnailHeight: 800,
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
          };
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
          dropContainer.className = wrapperClass;
          dropIcon.classList.replace('grid', 'hidden');
          dropIcon.classList.remove('place-items-center');
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
        this.on('dragenter', () => {
          dropContainer.classList.add('bg-black', 'bg-opacity-10');
          dropIconWrapper.classList.add('w-full', 'h-full');
          dropIcon.classList.replace('hidden', 'grid');
          dropIcon.classList.add('place-items-center');
        });
        this.on('dragleave', () => {
          dropContainer.classList.remove('bg-black', 'bg-opacity-10');
          dropIcon.classList.replace('grid', 'hidden');
          dropIcon.classList.remove('place-items-center');
        });
      },
    });
    document.getElementsByClassName('dz-message')[0].classList.add('hidden')
  });
</script>

<div bind:this={dropContainer} class={wrapperClass} id="drop-container">
  <form bind:this={fileDrop} class="dropzone overflow-hidden max-h-[inherit] h-[inherit]" id="file-drop">
    <div class="h-[90vh] max-lg:h-[85vh] overflow-hidden" bind:this={dropIconWrapper}>
      <div
        bind:this={dropIcon}
        class="bg-black overflow-hidden hidden absolute max-md:h-[75vh] lg:h-[82vh] max-md:w-full lg:w-[75vw] z-50 gap-3 opacity-50"
      >
        <div
          on:dragenter
          on:dragleave
          class="rounded-lg flex flex-col gap-2 bg-base-300 items-center p-40"
        >
          <iconify-icon class="text-9xl" icon="mdi:upload" />
          <span>{$t('files.dragHere')}</span>
        </div>
      </div>
      <slot />
    </div>
    <div id="preview-template" class="hidden justify-center items-center flex-col gap-2">
      <div class="dz-preview dz-file-preview text-lg hidden font-semibold" />
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
