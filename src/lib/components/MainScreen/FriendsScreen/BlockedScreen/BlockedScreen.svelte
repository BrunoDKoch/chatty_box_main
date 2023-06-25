<script lang="ts">
  import Button from '$lib/components/Custom/Button.svelte';
  import UserAvatarAndName from '$lib/components/UserAvatarAndName.svelte';
  import useBlockToggle from '$lib/useBlockToggle';
  import { blockedUsers } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  import { toKebabCase } from '$lib/useCaseConversion';
  async function handleClick(userId: string) {
    const userResponse = await useBlockToggle(userId);
    $blockedUsers = $blockedUsers.filter((b) => b.id !== userResponse.id);
  }
</script>

<div class="flex flex-col gap-3">
  {#each $blockedUsers as user}
    <UserAvatarAndName {user} size="half" extraText={$t('friends.blocked')}>
      <Button
        on:click={async () => await handleClick(user.id)}
        buttonUIType="warning"
        id="unblock-{toKebabCase(user.userName)}"
        tooltip={$t('common.unblock')}
        format="square"
        additionalClasses="text-xl"
      >
        <iconify-icon icon="mdi:account-lock-open" />
      </Button>
    </UserAvatarAndName>
  {/each}
</div>
