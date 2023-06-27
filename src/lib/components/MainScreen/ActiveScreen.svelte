<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import ChatScreen from './Chat/ChatScreen.svelte';
  import Aside from '../Aside/Aside.svelte';
  let innerWidth: number;
  $: {
    if (innerWidth > 1024 && $useActiveScreen === 'aside') $useActiveScreen = 'friends';
  }
</script>

<svelte:window bind:innerWidth />

<div class="{$useActiveScreen !== 'aside' ? 'bg-base-300' : ''} overflow-hidden h-screen">
  {#if $useActiveScreen === 'friends'}
    <FriendsScreen />
  {:else if $useActiveScreen === 'chat'}
    <ChatScreen />
  {:else if $useActiveScreen === 'aside'}
    <Aside />
  {/if}
</div>
