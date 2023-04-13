<script lang="ts">
  import type { LogInInfo } from '$lib/types/authTypes';
  import { logIn, getCurrentUser } from '$lib/useAuth';
  import Checkbox from '../Custom/Checkbox.svelte';
  import TextInput from '../Custom/TextInput.svelte';
  import ErrorModal from '../ErrorModal.svelte';
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  export let pending = false;
  const dispatch = createEventDispatcher();
  let email = '';
  let password = '';
  let remember = false;
  let submitted = false;
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
        text: 'O e-mail é obrigatório',
      },
    ],
    passwordRules: [
      {
        condition: !!password,
        text: 'A senha é obrigatória',
      },
    ],
  };
  $: {
    if (submitted && !pending) goto('/');
  }
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
    dispatch('success');
    pending = true;
    submitted = true;
    console.log({ pending });
    let body: LogInInfo = { email, password, remember };
    try {
      await logIn(body);
      await goto('/');
    } catch (err) {
      errorMsg = {
        status: (err as { code: number; error?: any }).code,
        error: (err as { code: number; error?: any }).error,
      };
    } finally {
      pending = false;
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
    labelText="E-mail"
    required
    rules={rules.emailRules}
    disabled={pending}
    bind:value={email}
  />
  <TextInput
    name="password"
    type="password"
    labelText="Senha"
    required
    rules={rules.passwordRules}
    disabled={pending}
    bind:value={password}
  />
  <Checkbox bind:checked={remember} name="remember" labelText="Lembrar minhas credenciais" />
  <button disabled={pending} class="btn">Submit</button>
  <a class="link" href="/auth/signup">Don't have an account? Click here!</a>
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
