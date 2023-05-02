<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  import Modal from '../Modal.svelte';
  export let MFACode: string;
  export let rememberMultiFactor: boolean;
  const dispatch = createEventDispatcher();
</script>

<Modal>
  <form
    action=""
    class="flex flex-col items-center gap-4"
    on:submit|preventDefault={() => dispatch('submit', MFACode)}
  >
    <div class="form-control">
      <label class="label" for="">
        <span class="label-text first-letter:uppercase">
          {$t('common.code', { values: { item: $t('security.mfa.mfa'), codeCount: 1 } })}
        </span>
      </label>
      <input class="input input-bordered" bind:value={MFACode} type="text" name="" id="" />
    </div>
    <div class="form-control">
      <label class="label gap-3" for="">
        <span class="label-text first-letter:uppercase">
          {$t('auth.rememberMultiFactor')}
        </span>
        <input class="checkbox" bind:checked={rememberMultiFactor} type="checkbox" name="" id="" />
      </label>
    </div>
    <button class="btn" type="submit">{$t('common.submit')}</button>
  </form>
</Modal>
