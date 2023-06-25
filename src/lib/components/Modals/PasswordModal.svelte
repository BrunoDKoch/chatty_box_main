<script lang="ts">
  import { t } from 'svelte-i18n';
  import TextInput from '../Custom/TextInput.svelte';
  import Modal from './Modal.svelte';
  import Button from '../Custom/Button.svelte';

  export let password: string;
  export let loading: boolean;
</script>

<Modal on:close>
  <form on:submit|preventDefault action="" method="post">
    <TextInput
      name="password"
      type="password"
      labelText="{$t('common.your.f')} {$t('auth.password')}"
      bind:value={password}
      required
    />
    <Button id="submit" buttonType="submit" bind:loading>
      {$t('common.submit')}
    </Button>
  </form>
</Modal>
