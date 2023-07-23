<script lang="ts">
  import { locale } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import { Converter } from 'showdown';
  import { ofetch } from 'ofetch';
  import { PUBLIC_IMAGES_URL_DEV as baseURL } from '$env/static/public';

  export let policy: 'tos' | 'privacy';
  const markDownPromise = ofetch(`/legal/${$locale}/${policy}.md`, {
    method: 'GET',
    credentials: 'include',
    baseURL,
  });
  function convertMarkdown(text: string) {
    const converter = new Converter();
    const htmlString = converter.makeHtml(text);
    return htmlString;
  }
</script>

<Modal on:close>
  {#await markDownPromise}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:then markDown}
  <div class="prose">
    {@html convertMarkdown(markDown)}
  </div>
  {/await}
</Modal>
