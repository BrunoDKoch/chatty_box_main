<script lang="ts">
  import { connection } from '$lib/useSignalR';
  import type { UserLoginAttempt } from '@prisma/client';
  import { onMount } from 'svelte';
  import { date, locale, t, time } from 'svelte-i18n';
  import LoginAttemptsModal from './Modals/LoginAttemptsModal.svelte';
  let attempts: UserLoginAttempt[] = [];
  let showModal = false;
</script>

<menu class="menu">
  <li>
    <button class="uppercase" on:click={() => (showModal = !showModal)}>Login attempts</button>
  </li>
</menu>

{#if showModal}
  <LoginAttemptsModal on:close={() => (showModal = !showModal)} />
{/if}
