<script lang="ts">
  import Button from '$lib/components/Custom/Button.svelte';
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import type { ButtonFormat, UiType } from '$lib/types/daisyUiTypes';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  export let request: { userAdding: UserPartialResponse };
  const { userAdding } = request;
  const { id } = userAdding;
  const actionButtons: {
    action: () => void;
    format: ButtonFormat;
    uiType: UiType;
    tooltip: string;
    icon: string;
  }[] = [
    {
      action() {
        dispatch('decision', { id, accept: true });
      },
      format: 'circle',
      uiType: 'success',
      tooltip: $t('common.accept', {
        values: { item: $t('friends.request', { values: { count: 1 } }) },
      }),
      icon: 'mdi:check',
    },
    {
      action() {
        dispatch('decision', { id, accept: false });
      },
      format: 'circle',
      uiType: 'error',
      tooltip: $t('common.decline', {
        values: { item: $t('friends.request', { values: { count: 1 } }) },
      }),
      icon: 'mdi:close',
    },
  ];

  const dispatch = createEventDispatcher();
</script>

<UserAvatarAndName user={request.userAdding} size="half">
  <div class="join items-center justify-center">
    {#each actionButtons as actionButton}
      <Button
        tooltip={actionButton.tooltip}
        on:click={() => actionButton.action()}
        buttonUIType={actionButton.uiType}
        format={actionButton.format}
        joinItem
      >
        <iconify-icon icon={actionButton.icon} />
      </Button>
    {/each}
  </div>
</UserAvatarAndName>
