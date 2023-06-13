<script lang="ts">
  import { t } from 'svelte-i18n';
  import { createEventDispatcher } from 'svelte';
  import SkeletonUserAvatarAndName from '$lib/components/SkeletonUserAvatarAndName.svelte';
</script>

<div class="py-5">
  <div class="grid grid-cols-2 indicator lg:gap-3">
    <SkeletonUserAvatarAndName size="half">
      <div class="join">
        <button
          disabled
          aria-label={$t('friends.newChat')}
          data-tip={$t('friends.newChat')}
          class="btn max-md:btn-md lg:text-3xl max-md:text-xl join-item tooltip"
        >
          <iconify-icon icon="mdi:message-plus" />
        </button>
        <button
          disabled
          data-tip={$t('common.remove', {
            values: { item: $t('common.friend', { values: { count: 1 } }) },
          })}
          aria-label={$t('common.remove', {
            values: { item: $t('common.friend', { values: { count: 1 } }) },
          })}
          class="btn max-md:btn-md lg:text-3xl max-md:text-xl btn-outline join-item tooltip"
        >
          <iconify-icon icon="mdi:close" />
        </button>
      </div>
    </SkeletonUserAvatarAndName>
  </div>
</div>
