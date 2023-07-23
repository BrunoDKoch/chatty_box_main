<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import ChatScreen from './Chat/ChatScreen.svelte';
  import Aside from '../Aside/Aside.svelte';
  import canFetchChat from '$lib/canFetchChat';
  import { onMount } from 'svelte';
  import { activeChatId } from '$lib/useActiveChat';
  let innerWidth: number;
  $: {
    if (innerWidth > 1024 && $useActiveScreen === 'aside') $useActiveScreen = 'friends';
  }

  useActiveScreen.subscribe((screen) => {
    if (!screen) return;
    localStorage.setItem('activeScreen', screen);
    if (screen === 'friends') $canFetchChat = true;
  });

  function getSavedChatId() {
    if (!localStorage) return;
    return localStorage.getItem('activeChatId');
  }

  onMount(() => {
    if (!localStorage) return;
    const savedScreen = localStorage.getItem('activeScreen');
    if (!savedScreen) {
      $useActiveScreen = 'friends';
    } else if ((savedScreen as typeof $useActiveScreen) === 'chat') {
      const savedChatId = getSavedChatId();
      if (!savedChatId) {
        $useActiveScreen = 'friends';
        return;
      }
      $activeChatId = savedChatId;
    }
    $useActiveScreen = savedScreen as typeof $useActiveScreen;
  });
</script>

<svelte:window bind:innerWidth />

<div
  class="{$useActiveScreen !== 'aside' ? 'bg-base-300' : ''} overflow-hidden h-full max-h-screen"
>
  {#if $useActiveScreen === 'friends'}
    <FriendsScreen />
  {:else if $useActiveScreen === 'chat'}
    <ChatScreen />
  {:else if $useActiveScreen === 'aside'}
    <Aside />
  {/if}
</div>
