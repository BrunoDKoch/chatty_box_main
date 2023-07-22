<script lang="ts">
  import friendsTab from '$lib/friendsTab';
  import { activeChatId } from '$lib/useActiveChat';
  import useActiveScreen from '$lib/useActiveScreen';
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let notificationType: 'message' | 'friend request';
  export let userName: string;
  export let text: string;
  export let action: string | undefined = undefined;
  const dispatch = createEventDispatcher();
  $: elapsedSeconds = 0;
  $: countdownValue = 5 - elapsedSeconds;
  const interval = setInterval(() => {
    elapsedSeconds++;
    if (elapsedSeconds >= 5) {
      clearInterval(interval);
      dispatch('close');
    }
  }, 1000);
  function handleClick() {
    if (action) {
      if ($activeChatId !== action) $activeChatId = action;
      $useActiveScreen = 'chat';
      return;
    }
    $useActiveScreen = 'friends';
    $friendsTab = 'friends.pending';
  }
  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<a
  href="/"
  on:click|preventDefault={() => handleClick()}
  class="alert {notificationType === 'message' ? 'toast-info' : 'toast-success'}"
>
  <iconify-icon icon="mdi:information-outline" />
  <div class="flex gap-1">
    <p class="font-bold">{userName}:</p>
    <span>{text}</span>
  </div>
  <div class="relative">
    <button
      on:click|stopPropagation={() => dispatch('close')}
      class="btn btn-circle box-border btn-ghost {notificationType === 'message'
        ? 'text-info-content'
        : 'text-success-content'} right-12"
    >
      <span class="opacity-100 absolute">
        {countdownValue}
      </span>
      <svg
        width="3rem"
        height="3rem"
        class="block items-center {notificationType === 'message'
          ? 'stroke-info-content'
          : 'stroke-success-content'}"
      >
        <circle r="20" cx="24" cy="24" /></svg
      >
      <iconify-icon icon="mdi:close" class="text-3xl opacity-0 absolute" />
    </button>
  </div>
</a>

<style lang="postcss">
  .toast-info {
    @apply alert-info text-info-content;
  }
  .toast-success {
  }
  button:hover span {
    @apply opacity-0;
  }
  button:hover iconify-icon {
    @apply opacity-100;
  }

  svg {
    position: absolute;
    width: 3rem;
    height: 3rem;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }

  svg circle {
    stroke-dasharray: 10rem;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 2px;
    fill: none;
    animation: countdown 5s linear forwards;
  }

  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 10rem;
    }
  }
</style>
