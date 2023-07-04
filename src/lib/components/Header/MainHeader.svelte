<script lang="ts">
  import useActiveScreen from '$lib/useActiveScreen';
  import Button from '$lib/components/Custom/Button.svelte';
  import { chat } from '$lib/useActiveChat';
  let previousActiveScreen: typeof $useActiveScreen = $useActiveScreen;
  function handleClick() {
    if ($useActiveScreen !== 'aside') {
      previousActiveScreen = $useActiveScreen;
      $useActiveScreen = 'aside';
    } else {
      $useActiveScreen = previousActiveScreen;
    }
  }
</script>

<header class="lg:hidden flex items-center bg-base-200 z-50">
  <Button
    id="change-screen"
    on:click={() => handleClick()}
    format="ghost"
    additionalClasses="text-4xl"
  >
    <iconify-icon icon="mdi:menu" />
  </Button>
  {#if $useActiveScreen === 'chat' && $chat}
    <h1 class="font-bold text-2xl">
      {$chat.chatName ?? $chat.users.map((u) => u.userName).join(', ')}
    </h1>
  {/if}
</header>
