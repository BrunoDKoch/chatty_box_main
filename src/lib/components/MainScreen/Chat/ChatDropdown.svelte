<script lang="ts">
  import { chat } from '$lib/useActiveChat';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';

  let open = false;
  const dispatch = createEventDispatcher();
  let options = [
    { label: $t('settings.notifications'), action: () => dispatch('openNotificationsModal') },
    { label: 'leave chat', action: () => dispatch('openConfirmLeaveModal') },
  ];
  $: {
    if ($chat.userIsAdmin) {
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

<div class="dropdown z-50 {open ? 'dropdown-open' : ''}">
  <button class="btn btn-ghost">
    <iconify-icon icon="mdi:dots-vertical" />
  </button>
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
</div>
