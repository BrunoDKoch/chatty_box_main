<script lang="ts">
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import useBlockToggle from '$lib/useBlockToggle';
  import { blockedUsers } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  async function handleClick(userId: string) {
    const userResponse = await useBlockToggle(userId);
    $blockedUsers = $blockedUsers.filter((b) => b.id !== userResponse.id);
  }
</script>

<div class="flex flex-col gap-3">
  {#each $blockedUsers as user}
    <UserAvatarAndName {user} size="half" extraText={$t('friends.blocked')}>
      <button
        on:click={async () => await handleClick(user.id)}
        class="btn btn-warning text-xl btn-square tooltip"
        data-tip={$t('common.unblock')}
      >
        <iconify-icon icon="mdi:account-lock-open" />
      </button>
    </UserAvatarAndName>
  {/each}
</div>
