<script lang="ts">
    import { PUBLIC_AUTH_URL_DEV } from '$env/static/public';
  import Dropzone, { type DropzoneFile } from 'dropzone';
  import { ofetch } from 'ofetch';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Transition } from 'svelte/types/compiler/interfaces';

  export let uploadSuccessful: boolean;
  export let uploading: boolean;

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

  const accept = 'image/*';

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
      url: `${PUBLIC_AUTH_URL_DEV}/User/Avatar`,
      clickable: true,
      previewTemplate: document.getElementById('preview-template')!.innerHTML,
      parallelUploads: 1,
      acceptedFiles: accept,
      maxFilesize: 20,
      withCredentials: true,
      dictFileTooBig: 'Arquivo muito grande! Por favor, envie arquivos de até 20MB.',
      filesizeBase: 1000,
      thumbnailHeight: 800,
      dictDefaultMessage: 'Arraste a imagem aqui ou clique para selecioná-la (limitado a 20MB)',
      thumbnailWidth: 800,
      thumbnailMethod: 'contain',
      maxFiles: 1,
      dictCancelUpload: 'Cancelar envio',
      dictRemoveFile: 'Remover imagem',

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
        await ofetch('/api/temp', {
          method: 'DELETE',
          body: {
            file: file.name,
          },
        });
        file.previewTemplate.removeChild(document.getElementsByClassName('dz-remove')[0]);
      },
      addRemoveLinks: true,
      uploadMultiple: false,
      ignoreHiddenFiles: true,
      hiddenInputContainer: document.getElementById('drop-container')!,
      init() {
        this.on('error', (file, message) => {
          console.log(message);
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
            console.log('triggered on success');
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
