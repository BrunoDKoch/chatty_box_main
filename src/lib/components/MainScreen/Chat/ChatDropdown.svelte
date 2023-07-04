<script lang="ts">
  import Button from '$lib/components/Custom/Button.svelte';
  import { chat } from '$lib/useActiveChat';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';

  let open = false;
  const dispatch = createEventDispatcher();
  let options = [
    { label: $t('settings.notifications'), action: () => dispatch('openNotificationsModal') },
    {
      label: $t('common.leave', { values: { item: 'chat' } }),
      action: () => dispatch('openConfirmLeaveModal'),
    },
  ];
  $: {
    if ($chat.isGroupChat && $chat.userIsAdmin) {
      const extraOptions = [
        {
          label: $t('common.add', {
            values: { item: $t('common.member') },
          }),
          action: () => dispatch('openUserSearchModal'),
        },
        {
          label: $t('common.add', { values: { item: 'admin' } }),
          action: () => dispatch('openAddAdminModal'),
        },
        {
          label: $t('common.remove', {
            values: { item: $t('common.member') },
          }),
          action: () => dispatch('openUserRemovalModal'),
        },
      ];
      options.push(...extraOptions);
    }
  }
</script>

<menu class="dropdown static z-50 {open ? 'dropdown-open' : ''}">
  <Button buttonType="button" on:click={() => (open = !open)} id="chat-dropdown-toggle" format="ghost">
    <iconify-icon icon="mdi:dots-vertical" />
  </Button>
  <ul class="dropdown-content menu bg-base-300 z-50">
    {#each options as option}
      <li class="z-50">
        <a on:click|preventDefault={() => option.action()} href="/">
          <span class="first-letter:uppercase">
            {option.label}
          </span>
        </a>
      </li>
    {/each}
  </ul>
</menu>
