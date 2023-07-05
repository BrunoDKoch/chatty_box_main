<script lang="ts">
  import { t } from 'svelte-i18n';
  import Button from '../Custom/Button.svelte';
  import TextInputWithButton from '../Custom/TextInputWithButton.svelte';
  import { connection, previews } from '$lib/useSignalR';
  import type { ChatPreview } from '$lib/types/partialTypes';
  export let search = '';
  let searchIcon: HTMLElement;
  let loadingIcon: HTMLElement;
  let searching = false;
  let placeholder = $t('aside.searchChats', { values: { search: $t('common.search') } });

  async function handleSubmit() {
    if (!search) {
      await connection.invoke('GetChatPreviews');
      return;
    }
    searching = true;
    const splitSearch = search.split(`${$t('common.user')}:`);
    let chatName;
    let userName;
    if (splitSearch.length < 2) {
      chatName = search;
      userName = undefined;
    } else {
      chatName = undefined;
      userName = splitSearch[1];
    }
    $previews = await connection.invoke<ChatPreview[]>('SearchForChat', chatName, userName);
    $previews = $previews;
    searching = false;
  }
</script>

<form
  on:submit|preventDefault={async () => await handleSubmit()}
  class="form-control overflow-hidden"
>
  <TextInputWithButton
    type="search"
    bind:value={search}
    placeholder={placeholder.replace(placeholder[0], placeholder[0].toUpperCase())}
    name="chatSearch"
    size="small"
  >
    <Button id="submit-chat-search" joinItem size="small">
      <label class="swap swap-rotate" for="submit">
        <input type="checkbox" bind:checked={searching} name="submit" />
        <iconify-icon
          icon="mdi:archive-search-outline"
          bind:this={searchIcon}
          class="swap-off"
          height="1.4rem"
        />
        <iconify-icon
          icon="svg-spinners:6-dots-scale"
          bind:this={loadingIcon}
          class="swap-on"
          height="1.4rem"
        />
      </label>
    </Button>
  </TextInputWithButton>
</form>
