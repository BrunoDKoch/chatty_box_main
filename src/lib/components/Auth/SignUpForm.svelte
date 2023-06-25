<script lang="ts">
  import TextInput from '../Custom/TextInput.svelte';
  import type { SignUpInfo } from '$lib/types/authTypes';
  import { logIn, signUp } from '$lib/useAuth';
  import { createEventDispatcher } from 'svelte';
  import QrCodeModal from '$lib/components/Modals/QrCodeModal.svelte';
  import EmailOtpModal from './EmailOTPModal.svelte';
  import { t } from 'svelte-i18n';
  import useError from '$lib/useError';
  import Button from '../Custom/Button.svelte';
  export let pending = false;
  const dispatch = createEventDispatcher();
  let qrCode: { content: string; height: number; width: number } | null = null;
  let token = '';
  let openOtpModal = false;
  $: email = '';
  $: password = '';
  $: userName = '';
  $: confirmEmail = '';
  $: confirmPassword = '';
  $: rules = {
    emailRules: [
      {
        condition: !!email,
        text: $t('auth.somethingWrong.m', {
          values: {
            thing: $t('auth.email'),
            complement: $t('auth.address'),
            condition: $t('auth.required.m'),
          },
        }),
      },
      {
        condition:
          !!email &&
          !!email.match(
            RegExp(
              "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
            ),
          ),
        text: $t('auth.somethingWrong.m', {
          values: {
            thing: $t('auth.email'),
            complement: $t('auth.address'),
            condition: $t('auth.invalid.m'),
          },
        }),
      },
    ],
    passwordRules: [
      {
        condition: !!password,
        text: $t('auth.somethingWrong.f', {
          values: {
            thing: $t('auth.password'),
            complement: '',
            condition: $t('auth.required.f'),
          },
        }),
      },
    ],
    userNameRules: [
      {
        condition: !!userName,
        text: $t('auth.somethingWrong.m', {
          values: {
            thing: $t('auth.userName'),
            complement: '',
            condition: $t('auth.required.m'),
          },
        }),
      },
    ],
    confirmPasswordRules: [
      {
        condition: !!confirmPassword,
        text: $t('auth.youMustConfirm', {
          values: {
            your: $t('common.your.f'),
            thing: $t('auth.password'),
          },
        }),
      },
      {
        condition: password === confirmPassword,
        text: $t('auth.noMatch.f', {
          values: {
            thing: `${$t('auth.password')}s`,
          },
        }),
      },
    ],
    confirmEmailRules: [
      {
        condition: !!confirmEmail,
        text: $t('auth.youMustConfirm', {
          values: {
            your: $t('common.your.m'),
            thing: $t('auth.email'),
          },
        }),
      },
      {
        condition: email === confirmEmail,
        text: $t('auth.noMatch.m', {
          values: {
            thing: `${$t('auth.email')}s`,
          },
        }),
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
    const body = { email, password, userName };
    dispatch('showSpinner');
    try {
      const res = await signUp(body);
      console.log(res);
      openOtpModal = true;
      pending = false;
      dispatch('showQR');
    } catch (err) {
      $useError = {
        status: (err as any).status,
        message: (err as any).message,
        cause: $t(`error.cause.${(err as any).status}`),
      };
    }
  }
</script>

<form
  on:submit|preventDefault={async () => await handleSubmit()}
  class="grid lg:grid-cols-2 gap-x-4"
  action=""
>
  <TextInput
    name="email"
    type="email"
    labelText="{$t('common.your.m')} {$t('auth.email')}"
    required
    bind:rules={rules.emailRules}
    bind:value={email}
  />
  <TextInput
    name="confirmEmail"
    type="email"
    labelText="{$t('auth.confirm')} {$t('common.your.m')} {$t('auth.email')}"
    required
    bind:rules={rules.confirmEmailRules}
    bind:value={confirmEmail}
  />
  <TextInput
    name="password"
    type="password"
    labelText="{$t('common.your.f')} {$t('auth.password')}"
    required
    bind:rules={rules.passwordRules}
    bind:value={password}
  />
  <TextInput
    name="confirmPassword"
    type="password"
    labelText="{$t('auth.confirm')} {$t('common.your.f')} {$t('auth.password')}"
    required
    bind:rules={rules.confirmPasswordRules}
    bind:value={confirmPassword}
  />
  <div class="lg:col-span-2">
    <TextInput
      name="username"
      labelText="{$t('common.your.m')} {$t('auth.userName')}"
      required
      bind:rules={rules.userNameRules}
      bind:value={userName}
    />
  </div>
  <div class="lg:col-span-2 lg:row-span-2 flex flex-col items-center justify-center">
    <Button id="signup-submit">{$t('common.submit')}</Button>
    <a class="link first-letter:uppercase" href="/auth/login">
      <span>{$t('common.already')} {$t('auth.have')} {$t('auth.anAccount')}?</span>
      <span class="capitalize">{$t('common.clickHere')}!</span>
    </a>
  </div>
</form>

{#if openOtpModal}
  <EmailOtpModal
    bind:email
    on:ok={async () =>
      await logIn({ email, password, remember: false, rememberMultiFactor: false })}
  />
{/if}
