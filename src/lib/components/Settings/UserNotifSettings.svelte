<script lang="ts">
  import { t } from 'svelte-i18n';
  import notificationSettings from '$lib/useUserNotificationSettings';
  import { connection } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import type { UserNotificationSettings } from '@prisma/client';
  const checkableOptions = [
    {
      text: $t('common.sound'),
      name: 'sound',
      checked: $notificationSettings?.playSound,
      action: 'playSound',
    },
    {
      text: $t('common.osNotification'),
      name: 'osNotification',
      checked: $notificationSettings?.showOSNotification,
      action: 'showOSNotification',
    },
    {
      text: $t('common.alert'),
      name: 'alert',
      checked: $notificationSettings?.showAlert,
      action: 'showAlert',
    },
  ] as const;
  async function handleChange(change: 'playSound' | 'showOSNotification' | 'showAlert') {
    if (!$notificationSettings) return;
    $notificationSettings[change] = !$notificationSettings[change];
    $notificationSettings = $notificationSettings;
    $notificationSettings = await connection.invoke(
      'UpdateNotificationSettings',
      $notificationSettings.playSound,
      $notificationSettings.showOSNotification,
      $notificationSettings.showAlert,
    );
  }
  onMount(
    async () =>
      ($notificationSettings = await connection.invoke<UserNotificationSettings>(
        'GetNotificationSettings',
      )),
  );
</script>

{#if $notificationSettings}
  <form action="">
    <div class="form-control">
      {#each checkableOptions as option}
        <label for={option.name} class="label uppercase">
          <span class="label-txt">{option.text}</span>
          <input
            on:change={async () => await handleChange(option.action)}
            class="toggle"
            bind:checked={option.checked}
            type="checkbox"
            name="sound"
            id=""
          />
        </label>
      {/each}
    </div>
  </form>
{:else}
  <iconify-icon icon="svg-spinners:6-dots-scale" class="text-5xl" />
{/if}
