<script lang="ts">
  import { page } from '$app/stores';
  import LogInForm from './LogInForm.svelte';
  import SignUpForm from './SignUpForm.svelte';
  import { t } from '$lib/locales/translations';
  $: pending = false;
  $: showSpinner = false;
</script>

<div
  class="hero min-h-screen bg-gradient-to-tr from-white via-orange-200 to-orange-500 dark:from-black dark:via-orange-900 dark:to-orange-600"
>
  <div class="hero-overlay bg-opacity-60" />
  <div class="hero-content min-w-full flex-col lg:flex-row-reverse">
    <div
      class="text-center lg:text-left"
      style="text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black,
    1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black;"
    >
      <h1 class="text-3xl font-bold first-letter:capitalize">{$t('common.hello')}, chatter</h1>
      <p class="first-letter:uppercase">
        {$t('common.please')}
        {$t($page.url.pathname.endsWith('signup') ? 'auth.signup' : 'auth.login')}
      </p>
    </div>
    <div class="card shadow-2xl bg-base-100">
      <div class="card-body min-w-full">
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
