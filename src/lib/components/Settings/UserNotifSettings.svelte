<script lang="ts">
  import { t } from 'svelte-i18n';
  import notificationSettings from '$lib/useUserNotificationSettings';
  import { connection } from '$lib/useSignalR';
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
    await connection.invoke(
      'UpdateNotificationSettings',
      $notificationSettings.playSound,
      $notificationSettings.showOSNotification,
      $notificationSettings.showAlert,
    );
  }
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
