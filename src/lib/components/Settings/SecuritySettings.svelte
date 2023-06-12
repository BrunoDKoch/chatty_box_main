<script lang="ts">
  import { t } from 'svelte-i18n';
  import LoginAttemptsModal from '../Modals/LoginAttemptsModal.svelte';
  import MfaModal from '../Modals/MFAModal.svelte';
  import SessionsModal from '../Modals/SessionsModal.svelte';
  let showLoginAttempts = false;
  let showMFAModal = false;
  let showSessionsModal = false;
  const securitySettings: { text: string; action: Function }[] = [
    {
      text: $t('security.loginAttempt.loginAttempts'),
      action: () => (showLoginAttempts = !showLoginAttempts),
    },
    {
      text: $t('security.mfa.mfa'),
      action: () => (showMFAModal = !showMFAModal),
    },
    {
      text: 'Sessions',
      action: () => (showSessionsModal = !showSessionsModal),
    },
  ];
</script>

<menu class="menu menu-lg uppercase">
  {#each securitySettings as setting}
    <li>
      <a href="/" on:click|preventDefault={() => setting.action()}>
        {setting.text}
      </a>
    </li>
  {/each}
</menu>

{#if showLoginAttempts}
  <LoginAttemptsModal on:close={() => (showLoginAttempts = !showLoginAttempts)} />
{:else if showMFAModal}
  <MfaModal on:close={() => (showMFAModal = !showMFAModal)} />
{:else if showSessionsModal}
  <SessionsModal on:close={() => (showSessionsModal = !showSessionsModal)} />
{/if}
