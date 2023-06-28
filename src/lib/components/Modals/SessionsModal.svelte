<script lang="ts">
  import Modal from './Modal.svelte';
  import { connection } from '$lib/useSignalR';
  import type { ClientConnectionPartialInfo } from '$lib/types/partialTypes';
  import SessionsTable from './Sessions/SessionsTable.svelte';
  import Button from '../Custom/Button.svelte';
  import { t } from 'svelte-i18n';
  import useError from '$lib/useError';
  let sessionsData = connection
    .invoke<ClientConnectionPartialInfo[]>('GetConnections')
    .then((data) => data);
  const headers = [
    $t('session.device'),
    $t('session.os'),
    $t('session.browser'),
    $t('session.country'),
    $t('session.city'),
    $t('session.active'),
  ];
  let selection = [] as string[];
  function handleSelection(id: string) {
    if (selection.includes(id)) return selection.filter((s) => s !== id);
    selection.push(id);
    return selection;
  }
  async function closeConnection() {
    try {
      console.log(selection)
      await connection.invoke('CloseConnection', selection);
      sessionsData = connection.invoke('GetConnections').then((data) => data);
      selection.length = 0;
    } catch (err) {
      $useError = {
        status: 500,
        cause: $t('error.signalR'),
        message: err as string,
      };
    }
  }
</script>

<Modal on:close>
  {#await sessionsData}
    <iconify-icon icon="svg-spinners:6-dots-scale" />
  {:then sessions}
    <SessionsTable
      on:selectToggle={({ detail }) => (selection = handleSelection(detail))}
      {sessions}
      {headers}
    />
    {#if selection && selection.length}
    <div class="modal-action">
      <Button id="close-session" on:click={async () => await closeConnection()}>
        {$t('common.closeThing', {
          values: { item: $t('common.session', { values: { count: selection.length } }) },
        })}
      </Button>
    </div>
    {/if}
  {/await}
</Modal>
