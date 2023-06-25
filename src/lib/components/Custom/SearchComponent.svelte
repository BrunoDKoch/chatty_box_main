<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import TextInput from './TextInput.svelte';
  import TextInputWithButton from './TextInputWithButton.svelte';
  import { chat } from '$lib/useActiveChat';
  import Button from './Button.svelte';
  const dispatch = createEventDispatcher();

  // These handle the search
  export let search = '';
  export let results: any;
  export let invokeCommand: string;
  export let receiveCommand: string;
  export let activeSearchPage = 1;

  let searchIcon: HTMLElement;
  let loadingIcon: HTMLElement;

  // Shows a spinner if fetching
  let fetching = false;

  connection.on(receiveCommand, (data: typeof results) => {
    results = data;
    fetching = false;
  });

  $: {
    if (!search) {
      if (results.length) results.length = 0;
      if (results.messages && results.messages.length) results.messages.length = 0;
      fetching = false;
    }
  }

  $: activeSearchPage, handleSubmit().then((data) => data);

  async function handleSubmit() {
    if (fetching) {
      fetching = false;
      return;
    }
    if (results && results.length) results.length = 0;
    fetching = true;
    const startDates = search.match(/start:[0-9]{4}-[0-9]{2}(-[0-9]{2})?/);
    const endDates = search.match(/end:[0-9]{4}-[0-9]{2}(-[0-9]{2})?/);
    const startDate = startDates ? new Date(startDates[0]) : undefined;
    const endDate = endDates ? new Date(endDates[0]) : undefined;
    const userNames = search.match(/user:\w+/);
    const userIds = userNames
      ? $chat.users
          .filter((u) =>
            userNames.find((un) =>
              u.userName.toLowerCase().includes(un.replace('user:', '').toLowerCase()),
            ),
          )
          .map((u) => u.id)
      : [];
    let cleanSearch = search
      .replace(/start:[0-9]{4}-[0-9]{2}(-[0-9]{2})?/g, '')
      .replace(/end:[0-9]{4}-[0-9]{2}(-[0-9]{2})?/g, '')
      .replace(/user:\w+/g, '')
      .trim();
    const skip = (activeSearchPage - 1) * 15;
    setTimeout(async () => {
      await connection.invoke(
        invokeCommand,
        $chat.id,
        cleanSearch,
        startDate,
        endDate,
        userIds,
        skip,
      );
      fetching = false;
    }, 500);
  }
</script>

<form on:submit|preventDefault={async () => await handleSubmit()} class="join">
  <TextInputWithButton name="chatSearch" type="search" size="small" bind:value={search}>
    <Button id="messages-search-submit" buttonType="submit" format="square" size="small" joinItem>
      <label class="swap swap-rotate" for="submit">
        <input type="checkbox" bind:checked={fetching} name="submit" />
        <iconify-icon
          icon="material-symbols:search"
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
