<script lang="ts">
  import { t } from 'svelte-i18n';
  import SkeletonUserAvatarAndName from '$lib/components/SkeletonUserAvatarAndName.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import type { MockActionButton } from '$lib/types/otherTypes';
  const actionButtons: MockActionButton[] = [
    {
      icon: 'mdi:chat-plus',
      uiType: 'neutral',
      tooltip: $t('friends.newChat'),
      id: 'new-chat',
    },
    {
      icon: 'mdi:close',
      uiType: 'error',
      tooltip: $t('common.remove', {
        values: { item: $t('common.friend', { values: { count: 1 } }) },
      }),
      id: 'remove-friend',
    },
  ];
</script>

<div class="py-5">
  <div class="grid grid-cols-2 indicator lg:gap-3">
    <SkeletonUserAvatarAndName size="half">
      <div class="join">
        {#each actionButtons as actionButton}
          <Button
            id={actionButton.id}
            format="outline"
            additionalClasses="max-lg:btn-md lg:text-3xl max-lg:text-xl join-item"
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
