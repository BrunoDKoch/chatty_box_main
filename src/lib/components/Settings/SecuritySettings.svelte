<script lang="ts">
  import { t } from 'svelte-i18n';
  import LoginAttemptsModal from '../Modals/LoginAttemptsModal.svelte';
  import MfaModal from '../Modals/MFAModal.svelte';
  import SessionsModal from '../Modals/SessionsModal.svelte';
  import ChangeEmailModal from '../Modals/AuthChange/ChangeEmailModal.svelte';
  import ChangePasswordModal from '../Modals/AuthChange/ChangePasswordModal.svelte';
  let showLoginAttempts = false;
  let showMFAModal = false;
  let showSessionsModal = false;
  let showChangeEmailModal = false;
  let showChangePasswordModal = false;
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
      text: $t('common.session', { values: { count: 2 } }),
      action: () => (showSessionsModal = !showSessionsModal),
    },
    {
      text: $t('common.change', { values: { item: $t('auth.email') } }),
      action: () => (showChangeEmailModal = !showChangeEmailModal),
    },
    {
      text: $t('common.change', { values: { item: $t('auth.password') } }),
      action: () => (showChangePasswordModal = !showChangePasswordModal),
    },
  ];
</script>

<menu class="menu 2xl:menu-lg uppercase">
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
{:else if showChangeEmailModal}
  <ChangeEmailModal on:close={() => (showChangeEmailModal = !showChangeEmailModal)} />
{:else if showChangePasswordModal}
  <ChangePasswordModal on:close={() => (showChangePasswordModal = !showChangePasswordModal)} />
{/if}
