<script lang="ts">
  import { page } from '$app/stores';
  import LogInForm from './LogInForm.svelte';
  import SignUpForm from './SignUpForm.svelte';
  $: pending = false;
  $: showSpinner = false;
</script>

<div
  class="hero min-h-screen"
  style="background-image: url(/images/244387502_542759916819566_9096678114121381781_n.jpeg);"
>
  <div class="hero-overlay bg-opacity-60" />
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div
      class="text-center lg:text-left"
      style="text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black,
    1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black;"
    >
      <h1 class="text-3xl font-bold">Hello, chatter</h1>
      <p>Please {$page.url.pathname.endsWith('signup') ? 'log in' : 'sign up'}</p>
    </div>
    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <div class="card-body">
        {#if $page.url.pathname.includes('signup')}
          <SignUpForm
            bind:pending
            on:error={() => (showSpinner = false)}
            on:success={() => (showSpinner = true)}
            on:showQR={() => (showSpinner = false)}
          />
        {:else}
          <LogInForm bind:pending on:success={() => (showSpinner = true)} />
        {/if}
      </div>
    </div>
  </div>
  {#if showSpinner}
    <iconify-icon icon="svg-spinners:6-dots-scale-middle" />
  {/if}
</div>
