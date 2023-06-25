<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import UserAvatarAndName from './UserAvatarAndName.svelte';
  import Button from './Custom/Button.svelte';
  export let selection: null | UserPartialResponse;

  const dispatch = createEventDispatcher();

  // These handle the search
  let search = '';
  let results: UserPartialResponse[] = [];

  // Ensures we're not firing requests constantly
  let timerHasStarted = false;

  // Shows a spinner if fetching
  let fetching = false;

  connection.on('searchResults', (data: UserPartialResponse[]) => {
    results = data;
    fetching = false;
  });

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
      await connection.invoke('SearchUser', search);
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
  <input type="search" class="input input-bordered" bind:value={search} />
  {#if fetching || results.length}
    <div class="dropdown dropdown-open">
      <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
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
                <UserAvatarAndName user={result} size={25} />
              </Button>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
</div>
