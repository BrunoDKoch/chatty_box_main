<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Custom/Button.svelte';
  import { getIcon } from '$lib/useError';
  import { t } from 'svelte-i18n';
  let cause = $page.error!.cause ?? $t(`error.cause.${$page.status}`);
  let message = $page.error!.message;
</script>

<div class="grid w-screen h-screen place-items-center">
  <div class="grid place-items-center">
    <div class="font-bold flex flex-col items-center gap-2">
      <iconify-icon class="text-9xl" icon={getIcon($page.status)} />
      <h1 class="text-3xl font-bold">{$page.status} - {$t(cause)}</h1>
    </div>
    <p>{$t(message)}</p>
    <Button id="return-home" link="/">{$t('common.return')}</Button>
  </div>
</div>
