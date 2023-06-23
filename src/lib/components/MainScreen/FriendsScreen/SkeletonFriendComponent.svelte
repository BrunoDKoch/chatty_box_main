<script lang="ts">
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import SkeletonUserAvatarAndName from '$lib/components/SkeletonUserAvatarAndName.svelte';
  import type { UiType } from '$lib/types/daisyUiTypes';
  import Button from '$lib/components/Custom/Button.svelte';
  const actionButtons: {
    icon: string;
    uiType: UiType;
    tooltip: string;
  }[] = [
    {
      icon: 'mdi:chat-plus',
      uiType: 'neutral',
      tooltip: $t('friends.newChat'),
    },
    {
      icon: 'mdi:close',
      uiType: 'error',
      tooltip: $t('common.remove', {
        values: { item: $t('common.friend', { values: { count: 1 } }) },
      }),
    },
  ];
</script>

<div class="py-5">
  <div class="grid grid-cols-2 indicator lg:gap-3">
    <SkeletonUserAvatarAndName size="half">
      <div class="join">
        {#each actionButtons as actionButton}
          <Button
            format="outline"
            additionalClasses="max-md:btn-md lg:text-3xl max-md:text-xl join-item"
            loading
            tooltip={actionButton.tooltip}
            buttonUIType={actionButton.uiType}
          >
            <iconify-icon icon={actionButton.icon} />
          </Button>
        {/each}
      </div>
    </SkeletonUserAvatarAndName>
  </div>
</div>
