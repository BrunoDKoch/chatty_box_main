<script lang="ts">
  import { t } from 'svelte-i18n';
  import friendsTab from '$lib/friendsTab';
  import PendingScreen from './PendingScreen/PendingScreen.svelte';
  import { friendRequests } from '$lib/useSignalR';
  export let friends: { userName: string; isOnline: boolean; avatar?: string }[];
</script>

<div class="px-10 my-4 even:bg-base-200">
  {#if $friendsTab === 'friends.available'}
    {#if friends.length}
      {#each friends as friend}
        <div class="py-3">
          <div class="grid grid-cols-5 indicator gap-3">
            <span
              class="indicator-item indicator-start badge {friend.isOnline
                ? 'badge-success'
                : 'badge-ghost'}"
            />
            <figure class="avatar mask mask-squircle w-[50px] h-[50px]">
              {#if friend.avatar}
                <img src={friend.avatar} alt="" />
              {:else}
                <div
                  class="flex items-center justify-center bg-blue-600 text-white dark:bg-blue-800 w-full h-full"
                >
                  <p class="text-center font-bold py-2 text-3xl">{friend.userName[0]}</p>
                </div>
              {/if}
            </figure>
            <div class="col-span-3 flex flex-col">
              <p>{friend.userName}</p>
              <p>{friend.isOnline ? 'Online' : 'Offline'}</p>
            </div>
            <div class="btn-group">
              <button aria-label={$t('friends.newChat')} class="btn text-3xl">
                <iconify-icon icon="mdi:message-plus" />
              </button>
              <button
                aria-label="{$t('common.remove')} {$t('common.friend')}"
                class="btn text-3xl btn-outline btn-error"
              >
                <iconify-icon icon="mdi:close" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <h2 class="first-letter:uppercase">{$t('friends.noFriends')}</h2>
    {/if}
  {:else if $friendsTab === 'friends.pending'}
    <PendingScreen requests={$friendRequests} />
  {/if}
</div>
