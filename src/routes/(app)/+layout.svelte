<script lang="ts">
  import '../../app.css';
  import 'iconify-icon';
  import { onDestroy, onMount } from 'svelte';
  import type { LayoutServerData } from './$types';
  import { locale } from 'svelte-i18n';
  import { theme } from '$lib/theme';
  import { ofetch } from 'ofetch';
  import { connection, online } from '$lib/useSignalR';
  import { HubConnectionState } from '@microsoft/signalr';
  import { goto } from '$app/navigation';
  import useError from '$lib/useError';
  import { t } from 'svelte-i18n';
  import { page } from '$app/stores';
  import ConnectingComponent from '$lib/components/ConnectingComponent.svelte';
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';

</script>

<title>ChattyBox</title>

<main class="dark:bg-black h-screen w-screen overflow-hidden">
  <slot />
</main>

{#if $useError}
  <ErrorModal error={$useError} on:close={() => ($useError = null)} />
{/if}
