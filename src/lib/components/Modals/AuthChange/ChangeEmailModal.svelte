<script lang="ts">
  import TextInput from '$lib/components/Custom/TextInput.svelte';
  import { t } from 'svelte-i18n';
  import Modal from '../Modal.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import { changeEmail } from '$lib/useAuth';
  import useError from '$lib/useError';
  import { createEventDispatcher } from 'svelte';
  import useFormValidation from '$lib/useFormValidation';

  const dispatch = createEventDispatcher();

  let currentEmail = '';
  let newEmail = '';
  let password = '';
  let loading = false;
  let success = false;
  $: valid = false;
  $: rules = {
    newEmailRules: [
      {
        condition: !!newEmail,
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
          !!newEmail &&
          !!newEmail.match(
            RegExp(
              "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
            ),
          ),
        text: $t('common.invalid.m', { values: { item: $t('auth.email') } }),
      },
      {
        condition: newEmail !== currentEmail,
        text: $t('common.itemsCannot', {
          values: { items: `${$t('auth.email')}s`, finalPart: $t('common.theSame.m') },
        }),
      },
    ],
    currentEmailRules: [
      {
        condition: !!currentEmail,
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
          !!currentEmail &&
          !!currentEmail.match(
            RegExp(
              "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
            ),
          ),
        text: $t('common.invalid.m', { values: { item: $t('auth.email') } }),
      },
      {
        condition: newEmail !== currentEmail,
        text: $t('common.itemsCannot', {
          values: { items: `${$t('auth.email')}s`, finalPart: $t('common.theSame.m') },
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
  $: currentEmail, newEmail, password, validateForm();
  function validateForm() {
    for (const val of Object.values(rules)) {
      const checkRules = useFormValidation(val);
      if (!checkRules) {
        valid = false;
        return;
      }
    }
    valid = true;
  }
  async function handleSubmit() {
    try {
      await changeEmail({ currentEmail, newEmail, password });
      success = true;
    } catch (err) {
      $useError = {
        status: (err as any).status,
        cause: $t(`error.cause.${(err as any).status}`),
        message: err as string,
      };
    } finally {
      loading = false;
    }
  }
</script>

<Modal on:close>
  {#if success}
    <div class="modal-top text-success">
      <iconify-icon icon="mdi:check" class="text-6xl" />
      <h1 class="uppercase">{$t('common.changed.m', { values: { item: $t('auth.email') } })}</h1>
    </div>
    <div class="modal-action">
      <Button id="modal-ok" buttonUIType="success" on:click={() => dispatch('close')}>Ok</Button>
    </div>
  {:else}
    <div class="modal-top uppercase text-center">
      <h1>{$t('common.change', { values: { item: $t('auth.email') } })}</h1>
    </div>
    <div class="modal-middle">
      <form on:submit={async () => await handleSubmit()} class="grid place-items-center" action="">
        <TextInput
          labelText="{$t('common.your.m')} {$t('common.current', {
            values: { item: $t('auth.email') },
          })}"
          type="email"
          bind:value={currentEmail}
          required
          bind:rules={rules.currentEmailRules}
          name="currentEmail"
        />
        <TextInput
          labelText="{$t('common.your.m')} {$t('common.new.m')} {$t('auth.email')}"
          type="email"
          bind:value={newEmail}
          required
          bind:rules={rules.newEmailRules}
          name="newEmail"
        />
        <TextInput
          labelText="{$t('common.your.f')} {$t('auth.password')}"
          type="password"
          bind:value={password}
          required
          bind:rules={rules.passwordRules}
          name="password"
        />
        <Button disabled={!valid} bind:loading id="reset-email">{$t('common.submit')}</Button>
      </form>
    </div>
  {/if}
</Modal>
