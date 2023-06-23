<script lang="ts">
  import type { SystemMessagePartial } from '$lib/types/combinationTypes';
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  export let message: SystemMessagePartial;
  function getAction() {
    if (message.eventType.includes('left')) return 'left';
    if (message.eventType.includes('removed')) return 'removed';
    if (message.eventType.includes('admin')) return 'added admin';
    return 'added';
  }
  function getText() {
    const action = getAction();
    // If there's no affected user, use the 'left' translation
    if (!message.affectedUser) return $t('common.left');
    // Otherwise, include action and affected user's username
    const translatedAction = action.includes(' ')
      ? `${$t('common.added')} ${message.affectedUser.userName} ${$t('common.asAn')} ${$t(
          'common.admin',
        )}`
      : `${$t(`common.${action}`)} ${message.affectedUser.userName}`;
    return translatedAction;
  }
  onMount(() => getText());
</script>

<p class="opacity-70 text-center first-letter:uppercase">
  {message.instigatingUser.userName}
  {getText()}
</p>
