<script lang="ts">
  import { t } from 'svelte-i18n';
  import LoginAttemptsModal from './Modals/LoginAttemptsModal.svelte';
  import MfaModal from './Modals/MFAModal.svelte';
  let showLoginAttempts = false;
  let showMFAModal = false;
</script>

<menu class="menu uppercase">
  <li>
    <a href="/" on:click|preventDefault={() => (showLoginAttempts = !showLoginAttempts)}>
      {$t('security.loginAttempt.loginAttempts')}
    </a>
  </li>
  <li>
    <a href="/" on:click|preventDefault={() => (showMFAModal = !showMFAModal)}>
      {$t('security.mfa.mfa')}
    </a>
  </li>
</menu>

{#if showLoginAttempts}
  <LoginAttemptsModal on:close={() => (showLoginAttempts = !showLoginAttempts)} />
{:else if showMFAModal}
  <MfaModal on:close={() => (showMFAModal = !showMFAModal)} />
{/if}
