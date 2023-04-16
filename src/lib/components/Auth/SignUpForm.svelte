<script lang="ts">
  import TextInput from '../Custom/TextInput.svelte';
  import type { SignUpInfo } from '$lib/types/authTypes';
  import { signUp } from '$lib/useAuth';
  import ErrorModal from '../ErrorModal.svelte';
  import { createEventDispatcher } from 'svelte';
  import QrCodeModal from '../QrCodeModal.svelte';
  import EmailOtpModal from './EmailOTPModal.svelte';
  import { t } from 'svelte-i18n';
  export let pending = false;
  const dispatch = createEventDispatcher();
  let qrCode: { content: string; height: number; width: number } | null = null;
  let token = '';
  let openOtpModal = false;
  let email = '';
  let password = '';
  let userName = '';
  let confirmEmail = '';
  let confirmPassword = '';
  let errorMsg: {
    status: number;
    error: { message: string; cause: string };
  } | null = null;
  $: rules = {
    emailRules: [
      {
        condition: !!email,
        text: 'O e-mail é obrigatório',
      },
      {
        condition:
          !!email &&
          !!email.match(
            RegExp(
              "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
            ),
          ),
        text: 'Endereço de e-mail inválido',
      },
    ],
    passwordRules: [
      {
        condition: !!password,
        text: 'A senha é obrigatória',
      },
    ],
    userNameRules: [
      {
        condition: !!userName,
        text: 'O nome completo é obrigatório',
      },
    ],
    confirmPasswordRules: [
      {
        condition: !!confirmPassword,
        text: 'Você precisa confirmar a senha',
      },
      {
        condition: password === confirmPassword,
        text: 'Dados divergentes',
      },
    ],
    confirmEmailRules: [
      {
        condition: !!confirmEmail,
        text: 'Você precisa confirmar o e-mail',
      },
      {
        condition: email === confirmEmail,
        text: 'Dados divergentes',
      },
    ],
  };

  function checkIfValid() {
    let totalConditions = 0;
    let totalValid = 0;
    Object.keys(rules).forEach((key) => {
      rules[key as keyof typeof rules].forEach((condition) => {
        totalConditions++;
        condition.condition ? totalValid++ : null;
      });
    });
    if (totalValid === totalConditions) return true;
    return false;
  }
  async function handleSubmit() {
    const valid = checkIfValid();
    if (!valid) return;
    pending = true;
    console.log({ pending });
    const body = { email, password, userName };
    dispatch('success');
    try {
      const res = await signUp(body);
      console.log(res);
      openOtpModal = true;
      pending = false;
      dispatch('showQR');
    } catch (err) {
      errorMsg = {
        status: (err as { code: number; error?: any }).code,
        error: (err as { code: number; error?: any }).error,
      };
    }
  }
</script>

<form
  on:submit|preventDefault={async () => await handleSubmit()}
  class="grid grid-cols-2 gap-x-4"
  action=""
>
  <TextInput
    name="email"
    type="email"
    labelText="{$t('common.your.m')} {$t('auth.email')}"
    required
    rules={rules.emailRules}
    bind:value={email}
  />
  <TextInput
    name="confirmEmail"
    type="email"
    labelText="{$t('auth.confirm')} {$t('common.your.m')} {$t('auth.email')}"
    required
    rules={rules.confirmEmailRules}
    bind:value={confirmEmail}
  />
  <TextInput
    name="password"
    type="password"
    labelText="{$t('common.your.f')} {$t('auth.password')}"
    required
    rules={rules.passwordRules}
    bind:value={password}
  />
  <TextInput
    name="confirmPassword"
    type="password"
    labelText="{$t('auth.confirm')} {$t('common.your.f')} {$t('auth.password')}"
    required
    rules={rules.confirmPasswordRules}
    bind:value={confirmPassword}
  />
  <div class="col-span-2">
    <TextInput
      name="username"
      labelText="{$t('common.your.m')} {$t('auth.userName')}"
      required
      rules={rules.userNameRules}
      bind:value={userName}
    />
  </div>
  <div class="col-span-2 row-span-2 flex flex-col items-center justify-center">
    <button class="btn">{$t('common.submit')}</button>
    <a class="link first-letter:uppercase" href="/auth/login">
      <span>{$t('common.already')} {$t('auth.have')} {$t('auth.anAccount')}?</span>
      <span class="capitalize">{$t('common.clickHere')}!</span>
    </a>
  </div>
</form>

{#if errorMsg}
  <ErrorModal
    {...errorMsg}
    on:close={() => {
      pending = false;
      email = '';
      password = '';
      errorMsg = null;
    }}
  />
{/if}

{#if qrCode}
  <QrCodeModal token={qrCode.content} />
{/if}

{#if openOtpModal}
  <EmailOtpModal />
{/if}
