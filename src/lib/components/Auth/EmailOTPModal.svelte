<script lang="ts">
  import { validateEmail } from '$lib/useAuth';
  import TextInput from '../Custom/TextInput.svelte';

  let otp = '';
  $: rules = {
    otpRules: [
      {
        condition: !!Number(otp) && otp.length === 6,
        text: 'Código inválido',
      },
    ],
  };
  async function handleSubmit() {
    const res = await validateEmail({ code: otp });
    console.log(res)
  }
</script>

<dialog class="modal h-screen w-screen modal-open">
  <div class="modal-box">
    <form on:submit|preventDefault={async () => await handleSubmit()} action="">
      <TextInput
        rules={rules.otpRules}
        type="text"
        bind:value={otp}
        required
        name="otp"
        labelText="Digite o código enviado ao seu e-mail"
      />
      <button class="btn">Enviar</button>
    </form>
  </div>
</dialog>
