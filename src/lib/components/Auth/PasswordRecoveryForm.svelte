<script lang="ts">
  import { t } from 'svelte-i18n';
  import TextInput from '../Custom/TextInput.svelte';
  import { getRecoveryToken, recoverPassword } from '$lib/useAuth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
    import Button from '../Custom/Button.svelte';
  export let errorMsg: { status: number; message: string; cause: string } | null = null
  export let email: string = '';
  export let token: string = '';
  
  let password = '';
  let confirmPassword = '';
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
    ],
    passwordRules: [
      {
        condition: !!password,
        text: $t('auth.somethingWrong.f', {
          values: { thing: $t('auth.password'), complement: '', condition: $t('auth.required.f') },
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
  };
  async function handleSubmit() {
    try {
      if (!email) return;
      if (!token) {
        const res = await getRecoveryToken({ email });
        console.log(res);
        token = res.result;
        await goto(`${$page.url.pathname}?email=${email}&token=${token.replaceAll('/', '%2F')}`, {
          replaceState: true,
        });
        return;
      }
      const res = await recoverPassword({ password, email, token });
      console.log(res);
    } catch (err) {
      errorMsg = {
        status: (err as any).status,
        message: (err as any).error.message,
        cause: $t(`error.cause.${(err as any).status}`),
      }
    }
  }
  console.log(email);
</script>

<form
  on:submit|preventDefault={async () => await handleSubmit()}
  class="flex flex-col items-center justify-center"
  action=""
  method="post"
>
  {#if !token}
    <TextInput
      name="email"
      labelText={$t('auth.email')}
      type="email"
      bind:value={email}
      required
      rules={rules.emailRules}
    />
  {:else}
    <TextInput
      type="password"
      name="password"
      bind:value={password}
      rules={rules.passwordRules}
      required
      labelText={$t('auth.password')}
    />
    <TextInput
      type="password"
      name="confirmPassword"
      bind:value={confirmPassword}
      rules={rules.confirmPasswordRules}
      required
      labelText="{$t('auth.confirm')} {$t('common.your.f')} {$t('auth.password')}"
    />
  {/if}
  <Button>{$t('common.submit')}</Button>
</form>
