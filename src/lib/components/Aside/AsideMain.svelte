<script lang="ts">
  import { fade } from 'svelte/transition';
  import useActiveScreen from '$lib/useActiveScreen';
  import { t } from 'svelte-i18n';
  import AsideMsg from './AsidePreview.svelte';
  import NewChatModal from '../Modals/NewChatModal.svelte';
  import { fetchingInitialCallInfo, friendRequests } from '$lib/useSignalR';
  import { previews } from '$lib/useSignalR';
  import SkeletonPreview from './SkeletonPreview.svelte';
  import AsideLink from './AsideLink.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  let showNewChatModal = false;
  let buttonLinks = [
    {
      action() {
        $useActiveScreen = 'friends';
      },
      icon: 'material-symbols:person',
      text: $t('friends.friend', { values: { count: 2 } }),
      condition: !!($friendRequests && $friendRequests.length),
      extraText: $friendRequests.length.toString(),
    },
    {
      action() {
        showNewChatModal = !showNewChatModal;
      },
      icon: 'mdi:chat-plus',
      text: `${$t('common.new.m')} ${$t('common.groupChat')}`,
      condition: false,
    },
  ] as {
    action?: () => void;
    icon: string;
    text: string;
    condition: boolean;
    extraText?: string;
    link?: string;
  }[];
  async function runAdminCheck() {
    if (!$page.data.user || !$page.data.user.isAdmin) return;
    buttonLinks.push({
      icon: 'mdi:shield',
      text: $t('admin.title'),
      link: '/admin',
      condition: false,
    });
    buttonLinks = buttonLinks;
  }
  onMount(async () => {
    await runAdminCheck();
  });
</script>

<div out:fade={{ duration: 100 }} in:fade={{ delay: 150, duration: 100 }}>
  {#each buttonLinks as buttonLink}
    <AsideLink {...buttonLink} />
    <div class="divider" />
  {/each}
  <section
    id="chats"
    class="flex flex-col gap-4 even:bg-base-300 lg:overflow-y-auto max-lg:max-h-[57dvh] lg:max-h-[65dvh]"
  >
    {#if $fetchingInitialCallInfo}
      {#each { length: 7 } as _}
        <SkeletonPreview />
      {/each}
    {:else}
      {#each $previews as chat}
        <AsideMsg bind:chat />
      {/each}
    {/if}
  </section>
</div>

{#if showNewChatModal}
  <NewChatModal on:close={() => (showNewChatModal = !showNewChatModal)} />
{/if}
