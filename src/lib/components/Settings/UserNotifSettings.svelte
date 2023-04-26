<script lang="ts">
  import { t } from 'svelte-i18n';
  import notificationSettings from '$lib/useUserNotificationSettings';
  import { connection } from '$lib/useSignalR';
  async function handleChange(change: 'playSound' | 'showOSNotification') {
    if (!$notificationSettings) return;
    console.log($notificationSettings);
    $notificationSettings[change] = !$notificationSettings[change];
    $notificationSettings = $notificationSettings;
    await connection.invoke(
      'UpdateNotificationSettings',
      $notificationSettings.playSound,
      $notificationSettings.showOSNotification,
    );
    console.log($notificationSettings);
  }
</script>

{#if $notificationSettings}
  <form action="">
    <div class="form-control">
      <label for="sound" class="label">
        <span class="label-text">{$t('common.sound')}</span>
        <input
          on:change={async () => await handleChange('playSound')}
          class="toggle"
          bind:checked={$notificationSettings.playSound}
          type="checkbox"
          name="sound"
          id=""
        />
      </label>
      <label for="osNotification" class="label">
        <span class="label-text">{$t('common.osNotification')}</span>
        <input
          on:change={async () => await handleChange('showOSNotification')}
          class="toggle"
          bind:checked={$notificationSettings.showOSNotification}
          type="checkbox"
          name="osNotification"
          id=""
        />
      </label>
    </div>
  </form>
{:else}
  <iconify-icon icon="svg-spinners:6-dots-scale" class="text-5xl" />
{/if}
