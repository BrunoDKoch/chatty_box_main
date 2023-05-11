<script lang="ts">
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import { blockedUsers } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
</script>

<div class="flex flex-col gap-3">
  {#each $blockedUsers as user}
    <UserAvatarAndName {user} size="half" extraText={$t('friends.blocked')}>
      <button class="btn btn-warning tooltip" data-tip={$t('common.unblock')}>
        <iconify-icon icon="mdi:account-lock-open'" />
      </button>
    </UserAvatarAndName>
  {/each}
</div>
