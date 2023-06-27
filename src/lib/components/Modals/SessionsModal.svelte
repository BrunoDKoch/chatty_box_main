<script lang="ts">
  import Modal from './Modal.svelte';
  import { connection } from '$lib/useSignalR';
  import type { ClientConnectionPartialInfo } from '$lib/types/partialTypes';
  import SessionsTable from './Sessions/SessionsTable.svelte';
    import Button from '../Custom/Button.svelte';
    import { t } from 'svelte-i18n';
  let sessionsData = connection
    .invoke<ClientConnectionPartialInfo[]>('GetConnections')
    .then((data) => data);
  const headers = ['Device', 'OS', 'Browser', 'Country', 'City', 'Active'];
  let selection = [] as string[];
  function handleSelection(id: string) {
    if (selection.includes(id)) return selection.filter((s) => s !== id);
    selection.push(id);
    return selection;
  }
</script>

<Modal on:close>
  {#await sessionsData}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:then sessions}
    <SessionsTable on:selectToggle={({ detail }) => (selection = handleSelection(detail))} {sessions} {headers} />
      {#if selection && selection.length}
        <Button id="close-session" on:click>
          {$t('common.closeThing', {values: {item: $t('common.session', {values: {count: selection.length}})}})}
        </Button>
      {/if}
  {/await}
</Modal>
