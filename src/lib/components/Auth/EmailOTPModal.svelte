<script lang="ts">
  import { validateEmail } from '$lib/useAuth';
  import { t } from 'svelte-i18n';
  import TextInput from '../Custom/TextInput.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  import useError from '$lib/useError';
  import Button from '../Custom/Button.svelte';
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
        status: (err as any).status,
        message: (err as any).error.message,
        cause: $t(`error.cause.${(err as any).status}`),
      };
    }
  }
</script>

<Modal on:close>
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
