<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Custom/Button.svelte';
  import { getIcon } from '$lib/useError';
  import { t } from 'svelte-i18n';
  let cause = $page.error!.cause ?? $t(`error.cause.${$page.status}`);
  let message = $page.error!.message;
</script>

<div class="grid w-screen h-screen place-items-center bg-gradient-radial from-red-400 dark:from-red-800 via-base-200 to-white dark:to-black">
  <div class="grid place-items-center gap-5">
    <div class="font-bold flex flex-col items-center gap-2">
      <iconify-icon class="text-9xl" icon={getIcon($page.status)} />
      <h1 class="text-3xl font-bold">{$page.status} - {$t(cause)}</h1>
    </div>
    <p>{$t(message)}</p>
    <Button id="return-home" link="/">{$t('common.return')}</Button>
  </div>
</div>

<style lang="postcss">
  .background-animate {
    background-size: 400%;

    -webkit-animation: error_anim 10s ease infinite;
    -moz-animation: error_anim 10s ease infinite;
    animation: error_anim 10s ease infinite;
  }

  @keyframes error_anim {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>