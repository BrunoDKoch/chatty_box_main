<script lang="ts">
  import type { LogInInfo } from '$lib/types/authTypes';
  import { logIn, getCurrentUser } from '$lib/useAuth';
  import Checkbox from '../Custom/Checkbox.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import ErrorModal from '../ErrorModal.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t } from 'svelte-i18n';
  import MfaCodeModal from './MFACodeModal.svelte';
  export let pending = false;
  const dispatch = createEventDispatcher();
  let showMFACodeModal = false;
  let email = '';
  let password = '';
  let MFACode: string;
  let remember = false;
  let submitted = false;
  let rememberMultiFactor = false;
  let errorMsg: {
    status: number;
    error: { message: string; cause: string };
  } | null = null;
  $: {
    if (errorMsg) dispatch('error');
  }
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
      await goto('/');
    } catch (err) {
      if ((err as { code: number; error?: any }).code === 400) {
        showMFACodeModal = !showMFACodeModal;
        return;
      }
      errorMsg = {
        status: (err as { code: number; error?: any }).code,
        error: (err as { code: number; error?: any }).error,
      };
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
    rules={rules.emailRules}
    disabled={pending}
    bind:value={email}
  />
  <TextInput
    name="password"
    type="password"
    labelText={$t('auth.password')}
    required
    rules={rules.passwordRules}
    disabled={pending}
    bind:value={password}
  />
  <Checkbox bind:checked={remember} name="remember" labelText={$t('auth.remember')} />
  <button disabled={pending} class="btn">{$t('common.submit')}</button>
  <div class="flex flex-col gap-4">
    <a class="link first-letter:uppercase" href="/auth/signup">
      <span>{$t('common.negatory')} {$t('auth.have')} {$t('auth.anAccount')}?</span>
      <span class="capitalize">{$t('common.clickHere')}!</span>
    </a>
    <a href="/auth/recovery" class="link first-letter:uppercase">
      {$t('common.forgot', {values: {item: `${$t('common.your.f')} ${$t('auth.password')}`}})}?
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

{#if showMFACodeModal}
  <MfaCodeModal
    bind:MFACode
    bind:rememberMultiFactor
    on:submit={async () => {
      await handleSubmit();
    }}
  />
{/if}
