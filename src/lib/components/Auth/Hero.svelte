<script lang="ts">
  import { page } from '$app/stores';
  import useError from '$lib/useError';
  import LogInForm from './LogInForm.svelte';
  import PasswordRecoveryForm from './PasswordRecoveryForm.svelte';
  import SignUpForm from './SignUpForm.svelte';
  import { t } from 'svelte-i18n';
  export let email: string = '';
  export let token: string = '';
  $: pending = false;
  $: showSpinner = false;
  $: {
    if ($useError) {
      pending = false;
      showSpinner = false;
    }
  }
</script>

<div
  class="hero min-h-screen bg-gradient-to-tr from-white via-orange-200 to-orange-500 dark:from-black dark:via-orange-900 dark:to-orange-600"
>
  <div class="hero-overlay bg-opacity-60" />
  <div class="hero-content min-w-full flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left custom-shadow text-white">
      <h1 class="text-3xl font-bold first-letter:capitalize">{$t('common.hello')}, chatter</h1>
      <p class="first-letter:uppercase">
        {#if !$page.url.pathname.endsWith('recovery')}
          {$t('common.please')}
          {$t($page.url.pathname.endsWith('signup') ? 'auth.signup' : 'auth.login')}
        {:else}
          {$t('auth.letsRecover')}
        {/if}
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
        {:else if $page.url.pathname.includes('login')}
          <LogInForm
            bind:pending
            on:showSpinner={() => (showSpinner = true)}
            on:hideSpinner={() => (showSpinner = false)}
          />
        {:else}
          <PasswordRecoveryForm {email} {token} />
        {/if}
      </div>
    </div>
  </div>
  {#if showSpinner}
    <iconify-icon class="text-7xl" icon="svg-spinners:6-dots-scale-middle" />
  {/if}
</div>

<style>
  .custom-shadow {
    text-shadow: 2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 1px 1px black,
      -1px -1px black, 1px -1px black, -1px 1px black;
  }
</style>
