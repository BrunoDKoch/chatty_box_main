<script lang="ts">
  import type { LogInInfo } from '$lib/types/authTypes';
  import { logIn } from '$lib/useAuth';
  import Checkbox from '../Custom/Checkbox.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { t } from 'svelte-i18n';
  import MfaCodeModal from './MFACodeModal.svelte';
  import useError from '$lib/useError';
  import Button from '../Custom/Button.svelte';
  export let pending = false;
  const dispatch = createEventDispatcher();
  let showMFACodeModal = false;
  let email = '';
  let password = '';
  let MFACode: string;
  let remember = false;
  let submitted = false;
  let rememberMultiFactor = false;
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
    dispatch('showSpinner');
    pending = true;
    submitted = true;
    let body: LogInInfo = { email, password, remember, MFACode, rememberMultiFactor };
    try {
      await logIn(body);
      showMFACodeModal = false;
      await goto('/');
    } catch (err) {
      if ((err as { status: number; error?: any }).status === 400) {
        showMFACodeModal = !showMFACodeModal;
        return;
      }
      console.log(err);
      $useError = {
        status: (err as any).status,
        message: (err as any).message,
        cause: $t(`error.cause.${(err as any).status}`),
      };
      pending = false;
    } finally {
      pending = false;
      dispatch('hideSpinner');
    }
  }
</script>

<form
  class="flex flex-col items-center justify-center"
  on:submit|preventDefault={async () => await handleSubmit()}
>
  <TextInput
    name="email"
    type="email"
    labelText={$t('auth.email')}
    required
    bind:rules={rules.emailRules}
    disabled={pending}
    bind:value={email}
  />
  <TextInput
    name="password"
    type="password"
    labelText={$t('auth.password')}
    required
    bind:rules={rules.passwordRules}
    disabled={pending}
    bind:value={password}
  />
  <Checkbox bind:checked={remember} name="remember" labelText={$t('auth.remember')} />
  <Button id="login-submit" bind:loading={pending}>{$t('common.submit')}</Button>
  <div class="flex flex-col gap-4">
    <a class="link first-letter:uppercase" href="/auth/signup">
      <span>{$t('common.negatory')} {$t('auth.have')} {$t('auth.anAccount')}?</span>
      <span class="capitalize">{$t('common.clickHere')}!</span>
    </a>
    <a href="/auth/recovery" class="link first-letter:uppercase">
      {$t('common.forgot', { values: { item: `${$t('common.your.f')} ${$t('auth.password')}` } })}?
    </a>
  </div>
</form>

{#if showMFACodeModal}
  <MfaCodeModal
    bind:MFACode
    bind:rememberMultiFactor
    on:submit={async () => {
      await handleSubmit();
    }}
  />
{/if}
