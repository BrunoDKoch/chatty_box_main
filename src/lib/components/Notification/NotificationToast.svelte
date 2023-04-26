<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let notificationType: 'message' | 'friend request';
  export let text: string;
  const dispatch = createEventDispatcher();
  let radialProgress: HTMLElement;
  let elapsedSeconds = 0;
  const interval = setInterval(() => {
    elapsedSeconds++;
    radialProgress.innerText = String(5 - elapsedSeconds);
    if (elapsedSeconds >= 5) {
      radialProgress.style.removeProperty('--value');
      clearInterval(interval);
      dispatch('close');
    } else radialProgress.style.setProperty('--value', `${(5 - elapsedSeconds) * 20}`);
  }, 1000);
  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="alert {notificationType === 'message' ? 'alert-info' : 'alert-success'}">
  <div>
    <span>{text}</span>
  </div>
  <div class="close-button-container">
    <div bind:this={radialProgress} class="radial-progress" style="--value: 100">5</div>
    <button
      on:click={() => dispatch('close')}
      class="btn btn-circle btn-ghost absolute right-12 opacity-0"
    >
      <iconify-icon icon="mdi:close" class="text-3xl" />
    </button>
  </div>
</div>

<style>
  .close-button-container:hover div {
    @apply opacity-0;
  }
  .close-button-container:hover button {
    @apply opacity-100;
  }
</style>
