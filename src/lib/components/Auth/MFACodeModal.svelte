<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
    import Modal from '../Modal.svelte';
  let code = '';
  const dispatch = createEventDispatcher();
</script>

<Modal>
  <form action="" on:submit|preventDefault={() => dispatch('submit', code)}>
    <div class="form-control">
      <label class="label" for="">
        <span class="label-text">{$t('security.mfa.mfa')}</span>
        <input class="input-bordered" bind:value={code} type="text" name="" id="" />
      </label>
      <button class="btn" type="submit">{$t('common.submit')}</button>
    </div>
  </form>
</Modal>
