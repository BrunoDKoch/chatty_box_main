<script lang="ts">
  import { t } from 'svelte-i18n';
</script>

<div class="flex flex-col items-center w-screen h-screen justify-center">
  <iconify-icon class="text-9xl" icon="svg-spinners:6-dots-scale" />
  <p class="first-letter:uppercase">{$t('common.connecting')}, {$t('common.pleaseWait')}</p>
</div>
