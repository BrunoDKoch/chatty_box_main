<script lang="ts">
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { createEventDispatcher } from 'svelte';
  import { t } from 'svelte-i18n';
  export let request: { userAdding: UserPartialResponse };
  const { userAdding } = request;
  const { id } = userAdding;
  const dispatch = createEventDispatcher();
</script>

<UserAvatarAndName user={request.userAdding} size="half">
  <div class="join items-center justify-center">
    <button
      data-tip={$t('common.accept', {
        values: { item: $t('friends.request', { values: { count: 1 } }) },
      })}
      on:click={() => dispatch('decision', { id, accept: true })}
      class="btn join-item btn-circle btn-success tooltip"
    >
      <iconify-icon icon="mdi:check" />
    </button>
    <button
      data-tip={$t('common.decline', {
        values: { item: $t('friends.request', { values: { count: 1 } }) },
      })}
      on:click={() => dispatch('decision', { id, accept: false })}
      class="btn join-item btn-circle btn-error tooltip"
    >
      <iconify-icon icon="mdi:close" />
    </button>
  </div>
</UserAvatarAndName>
