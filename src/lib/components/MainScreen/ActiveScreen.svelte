<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import FriendsScreen from './FriendsScreen/FriendsScreen.svelte';
  import ChatScreen from './Chat/ChatScreen.svelte';
  import Aside from '../Aside/Aside.svelte';
</script>

{#if $useActiveScreen === 'friends'}
  <FriendsScreen />
{:else if $useActiveScreen === 'chat'}
  <ChatScreen />
{:else if $useActiveScreen === 'aside'}
  <Aside />
{/if}
