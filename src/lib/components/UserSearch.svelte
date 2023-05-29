<script lang="ts">
  import { PUBLIC_IMAGES_URL } from '$env/static/public';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { connection } from '$lib/useSignalR';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
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
    console.log(timerHasStarted);
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
              <button
                on:click={() => {
                  selection = result;
                  search = String(result.userName);
                }}
                class="flex gap-3"
              >
                <figure class="avatar mask mask-squircle w-[25px] h-[25px]">
                  {#if result.avatar}
                    <img
                      src="{PUBLIC_IMAGES_URL}/{result.avatar}?width=25"
                      alt="{result.userName} avatar"
                    />
                  {:else}
                    <div
                      class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 w-full h-full"
                    >
                      <p class="font-bold bg-blue-600 dark:bg-blue-800 text-white text-center">
                        {result.userName[0]}
                      </p>
                    </div>
                  {/if}
                </figure>
                <p>{result.userName}</p>
              </button>
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
</div>
