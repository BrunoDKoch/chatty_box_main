<script lang="ts">
  import { chat } from "$lib/useActiveChat";
  $: userNamesJoined = $chat.users.map((u) => u.userName).join(', ');
</script>

<div class="bg-base-200 max-md:w-full lg:w-[75vw] z-30">
  {#if $chat.chatName}
    <h1>{$chat.chatName}</h1>
  {:else}
    <h1>{userNamesJoined}</h1>
  {/if}
</div>