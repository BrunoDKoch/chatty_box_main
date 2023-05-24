<script lang="ts">
  import { validateEmail } from '$lib/useAuth';
  import { t } from 'svelte-i18n';
  import TextInput from '../Custom/TextInput.svelte';
  import Modal from '$lib/components/Modals/Modal.svelte';
  import { createEventDispatcher } from 'svelte';
  export let email: string;
  export let errorMsg: { status: number; message: string; cause: string } | null = null
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
      errorMsg = {
        status: (err as any).status,
        message: (err as any).error.message,
        cause: $t(`error.cause.${(err as any).status}`),
      }
    }
  }
</script>

<Modal>
  <form on:submit|preventDefault={async () => await handleSubmit()} action="">
    <TextInput
      rules={rules.otpRules}
      type="text"
      bind:value={otp}
      required
      name="otp"
      labelText={$t('auth.typeCode')}
    />
    <button class="btn">{$t('common.submit')}</button>
  </form>
</Modal>
