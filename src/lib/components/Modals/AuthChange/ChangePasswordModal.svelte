<script lang="ts">
  import TextInput from '$lib/components/Custom/TextInput.svelte';
  import { t } from 'svelte-i18n';
  import Modal from '../Modal.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import { changePassword } from '$lib/useAuth';
  import useError from '$lib/useError';
  import { createEventDispatcher } from 'svelte';
  import useFormValidation from '$lib/useFormValidation';

  const dispatch = createEventDispatcher();

  let currentPassword = '';
  let newPassword = '';
  let loading = false;
  let success = false;
  $: valid = false;
  $: rules = {
    currentPasswordRules: [
      {
        condition: !!currentPassword,
        text: $t('auth.somethingWrong.f', {
          values: { thing: $t('auth.password'), complement: '', condition: $t('auth.required.f') },
        }),
      },
      {
        condition: newPassword !== currentPassword,
        text: $t('common.itemsCannot', {
          values: { items: `${$t('auth.password')}s`, finalPart: $t('common.theSame.f') },
        }),
      },
    ],
    newPasswordRules: [
      {
        condition: !!newPassword,
        text: $t('auth.somethingWrong.f', {
          values: { thing: $t('auth.password'), complement: '', condition: $t('auth.required.f') },
        }),
      },
      {
        condition: newPassword !== currentPassword,
        text: $t('common.itemsCannot', {
          values: { items: `${$t('auth.password')}s`, finalPart: $t('common.theSame.f') },
        }),
      },
    ],
  };
  function validate() {
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
      await changePassword({ currentPassword, newPassword });
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
      <h1 class="uppercase">{$t('common.changed.f', { values: { item: $t('auth.password') } })}</h1>
    </div>
    <div class="modal-action">
      <Button id="modal-ok" buttonUIType="success" on:click={() => dispatch('close')}>Ok</Button>
    </div>
  {:else}
    <form on:submit={async () => await handleSubmit()} class="grid place-items-center" action="">
      <TextInput
        labelText="{$t('common.your.m')} {$t('common.current', {
          values: { item: $t('auth.email') },
        })}"
        type="password"
        bind:value={currentPassword}
        required
        bind:rules={rules.currentPasswordRules}
        name="currentPassword"
      />
      <TextInput
        labelText="{$t('common.your.f')} {$t('auth.password')}"
        type="password"
        bind:value={newPassword}
        required
        bind:rules={rules.newPasswordRules}
        name="newPassword"
      />
      <Button disabled={!valid} bind:loading id="reset-email">{$t('common.submit')}</Button>
    </form>
  {/if}
</Modal>
