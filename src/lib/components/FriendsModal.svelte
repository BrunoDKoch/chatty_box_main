<script lang="ts">
  import { scale } from 'svelte/transition';
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import { connection } from '$lib/useSignalR';
  import type { User } from '@prisma/client';
  import Modal from './Modal.svelte';
  const dispatch = createEventDispatcher();
  
  // These handle the search
  let search = '';
  let results: User[] = [];
  let selection: User | null = null;

  // Ensures we're not firing requests constantly
  let timerHasStarted = false;

  // Shows a spinner if fetching
  let fetching = false;

  connection.on('searchResults', (data: User[]) => {
    results = data;
    fetching = false;
  });

  $: search, startTimer(search);
  $: timerHasStarted, handleTimer(timerHasStarted).then((data) => data);

  function startTimer(search: string) {
    if (!search || search == selection?.userName) return;
    if (!timerHasStarted) timerHasStarted = true;
  }

  async function handleTimer(timerHasStarted: boolean) {
    if (!timerHasStarted) return;
    if (results.length) results.length = 0;
    fetching = true;
    setTimeout(async () => await connection.invoke('SearchUser', search), 500);
  }

  async function handleSubmit() {
    if (!selection) return;
    await connection.invoke('SendFriendRequest', selection.id);
    dispatch('close');
  }
</script>

<Modal>
  <div class="flex justify-end">
    <button on:click={() => dispatch('close')} class="btn btn-circle btn-sm">
      <iconify-icon icon="mdi:close" />
    </button>
  </div>
  <div class="grid grid-cols-[1fr_3fr]">
    <iconify-icon
      class="row-span-2 self-center justify-self-center"
      icon="material-symbols:person-add"
      height="5rem"
    />
    <h1 class="font-bold text-2xl first-letter:uppercase">{$t('friends.add')}</h1>
    {#if !selection}
      <div class="form-control">
        <label for="" class="label capitalize">
          <span class="label-text">
            {$t('auth.userName')}
          </span>
        </label>
        <input type="text" class="input input-bordered" bind:value={search} />
        {#if fetching || results.length}
          <div class="dropdown dropdown-open">
            <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
              {#if fetching}
                <iconify-icon icon="svg-spinners:6-dots-scale" height="3rem" />
              {:else if results.length}
                {#each results as result}
                  <li
                    on:click={() => {
                      selection = result;
                      search = String(result.userName);
                    }}
                    on:keypress
                  >
                    {result.userName}
                  </li>
                {/each}
              {/if}
            </ul>
          </div>
        {/if}
      </div>
    {:else}
      <div class="grid grid-cols-3">
        <figure>
          <p>{selection.userName ? selection.userName[0] : ''}</p>
        </figure>
        <p class="col-span-2">{selection.userName}</p>
      </div>
    {/if}
  </div>
  <div class="modal-action">
    <div class="btn-group">
      <button class="btn btn-warning" on:click={() => (selection = null)}>
        {$t('common.clear')}
      </button>
      <button
        class="btn btn-success"
        disabled={!selection}
        on:click={async () => await handleSubmit()}
      >
        {$t('common.submit')}
      </button>
    </div>
  </div>
</Modal>
