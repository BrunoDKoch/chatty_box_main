<script lang="ts">
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import UserAvatarAndName from './UserAvatarAndName.svelte';
  import Button from './Custom/Button.svelte';
  import TextInput from './Custom/TextInput.svelte';
  export let selection: null | UserPartialResponse;
  export let chatId: string | null = null;

  const dispatch = createEventDispatcher();

  // These handle the search
  let search = '';
  let results: UserPartialResponse[] = [];

  // Ensures we're not firing requests constantly
  let timerHasStarted = false;

  // Shows a spinner if fetching
  let fetching = false;

  $: search, startTimer(search);
  $: {
    if (!search && results.length) results.length = 0;
  }
  $: timerHasStarted, handleTimer().then((data) => data);

  function startTimer(search: string) {
    if (!search || search === selection?.userName) return;
    if (!timerHasStarted) timerHasStarted = true;
  }

  async function handleTimer() {
    if (!timerHasStarted) return;
    if (results.length) results.length = 0;
    fetching = true;
    setTimeout(async () => {
      results = await connection.invoke<UserPartialResponse[]>('SearchUser', {
        userName: search,
        chatId,
      });
      fetching = false;
      timerHasStarted = false;
    }, 500);
  }
</script>

<div class="form-control">
  <label for="" class="label capitalize">
    <span class="label-text">
      {$t('auth.userName')}
    </span>
  </label>
  <TextInput noLabels type="search" name="userSearch" bind:value={search} />
  {#if fetching || results.length}
    <div class="dropdown dropdown-open">
      <ul class="dropdown-content menu p-2 gap-3 shadow bg-base-100 max-h-48 rounded-box w-full">
        {#if fetching}
          <iconify-icon icon="svg-spinners:6-dots-scale" height="3rem" />
        {:else if results.length}
          {#each results as result}
            <li>
              <Button
                id="submit-search"
                on:click={() => {
                  selection = result;
                  search = '';
                }}
                additionalClasses="flex gap-3"
              >
                <UserAvatarAndName disableModal user={result} size={25} />
              </Button>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
</div>
