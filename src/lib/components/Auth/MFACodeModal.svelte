<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import Button from '../Custom/Button.svelte';
  export let MFACode: string;
  export let rememberMultiFactor: boolean;
  const dispatch = createEventDispatcher();
</script>

<Modal on:close>
  <form
    action=""
    class="flex flex-col items-center gap-4"
    on:submit|preventDefault={() => dispatch('submit', MFACode)}
  >
    <TextInput
      type="text"
      bind:value={MFACode}
      labelText={$t('common.code', { values: { codeCount: 1, item: $t('security.mfa.mfa') } })}
      required
      name="MFA"
    />
    <div class="form-control">
      <label class="label gap-3" for="">
        <span class="label-text first-letter:uppercase">
          {$t('auth.rememberMultiFactor')}
        </span>
        <input class="checkbox" bind:checked={rememberMultiFactor} type="checkbox" name="" id="" />
      </label>
    </div>
    <Button id="modal-submit">{$t('common.submit')}</Button>
  </form>
</Modal>
