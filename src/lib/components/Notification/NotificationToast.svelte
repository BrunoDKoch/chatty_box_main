<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let notificationType: 'message' | 'friend request';
  export let userName: string;
  export let text: string;
  const dispatch = createEventDispatcher();
  let circleTimer: HTMLElement;
  $: elapsedSeconds = 0;
  $: countdownValue = 5 - elapsedSeconds;
  const interval = setInterval(() => {
    elapsedSeconds++;
    if (elapsedSeconds >= 5) {
      clearInterval(interval);
      dispatch('close');
    }
  }, 1000);
  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="alert {notificationType === 'message' ? 'alert-info text-info-content' : 'alert-success text-success-content'}">
  <div class="flex gap-1">
    <p class="font-bold">{userName}:</p>
    <span>{text}</span>
  </div>
  <div class="close-button-container">
    <div class="relative m-auto text-center" />
    <button
      on:click={() => dispatch('close')}
      class="btn btn-circle btn-ghost absolute {notificationType === 'message' ? 'text-info-content' : 'text-success-content'} right-12"
    >
      <span class="opacity-100 absolute">
        {countdownValue}
      </span>
      <svg width="3rem" height="3rem" class="absolute {notificationType === 'message' ? 'stroke-info-content' : 'stroke-success-content'}">
        <circle r="24" cx="24" cy="24" >
      </svg>
      <iconify-icon icon="mdi:close" class="text-3xl opacity-0 absolute" />
    </button>
  </div>
</div>

<style>
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
