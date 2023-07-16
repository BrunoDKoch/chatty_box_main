<script lang="ts">
  import { validateEmail } from '$lib/useAuth';
  import { t } from 'svelte-i18n';
  import TextInput from '../Custom/TextInput.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import useError from '$lib/useError';
  import Button from '../Custom/Button.svelte';
    import { page } from '$app/stores';
  export let email: string;
  let otp = '';
  $: rules = {
    otpRules: [
      {
        condition: !!Number(otp) && otp.length === 6,
        text: $t('common.invalid.m', {
          values: { item: $t('common.code', { values: { item: $t('auth.email') } }) },
        }),
      },
    ],
  };
  const dispatch = createEventDispatcher();
  async function handleSubmit() {
    try {
      const res = await validateEmail({ code: otp, email });
      console.log(res);
      dispatch('ok');
    } catch (err) {
      $useError = {
        status: (err as App.Error).status,
        message: (err as App.Error).message,
        cause: $t(`error.cause.${(err as App.Error).status}`),
      };
    }
  }
</script>

<Modal on:close>
  {#if $page.url.pathname === '/auth/login'}
    <h1 class="text-3xl font-bold first-letter:uppercase">
      {$t('auth.emailNotConfirmed')}
    </h1>
  {/if}
  <form on:submit|preventDefault={async () => await handleSubmit()} action="">
    <TextInput
      rules={rules.otpRules}
      type="text"
      bind:value={otp}
      required
      name="otp"
      labelText={$t('auth.typeCode')}
    />
    <Button id="modal-submit">{$t('common.submit')}</Button>
  </form>
</Modal>
