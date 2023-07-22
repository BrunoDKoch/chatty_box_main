<script lang="ts">
  import { PUBLIC_IMAGES_URL_DEV as baseURL } from '$env/static/public';
  import MessageSendFilePreview from './MessageSendFilePreview.svelte';
  import { activeChatId } from '$lib/useActiveChat';
  import { ofetch } from 'ofetch';
  import { messageFiles } from '$lib/useMessageFiles';

  export let files: string[];

  async function removeFile(data: CustomEvent<string>) {
    const { detail: filePath } = data;
    await ofetch(`/user/upload/${$activeChatId}`, {
      baseURL,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      body: { filePath },
      onResponse({ response }) {
        if (!response.ok) return;
        messageFiles.removeFile({ chatId: $activeChatId, filePath });
      },
    });
  }
</script>

<div class="grid grid-rows-1 grid-cols-4 relative">
  {#each files as file}
    <MessageSendFilePreview on:removeFile={removeFile} {file} index={files.indexOf(file)} />
  {/each}
</div>
