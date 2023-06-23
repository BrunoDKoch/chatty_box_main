<script lang="ts">
  import { chat } from '$lib/useActiveChat';
  import { connection } from '$lib/useSignalR';
  import { t } from 'svelte-i18n';
  import Modal from './Modal.svelte';
  import CloseButton from '../Custom/CloseButton.svelte';
  import { onMount } from 'svelte';
  import useUserNotificationSettings from '$lib/useUserNotificationSettings';
  import { previews } from '$lib/useSignalR';
  let activePreview = $previews.find((p) => p.id === $chat.id);
  async function handleChange(change: 'playSound' | 'showOSNotification') {
    if (!$chat || !$previews) return;
    if (!activePreview) return;

    await connection.invoke(
      'UpdateChatNotificationSettings',
      $chat.id,
      activePreview.playSound,
      activePreview.showOSNotification,
    );
  }
  onMount(() => {
    if (!$useUserNotificationSettings) return;
    if (!activePreview) return;
    if (activePreview.playSound === null)
      activePreview.playSound = $useUserNotificationSettings.playSound;
    if (activePreview.showOSNotification === null)
      activePreview.showOSNotification = $useUserNotificationSettings.showOSNotification;
  });
</script>

<Modal on:close>
  {#if activePreview}
    <form action="">
      <div class="form-control">
        <label for="sound" class="label uppercase">
          <span class="label-text">{$t('common.sound')}</span>
          <input
            on:change={async () => await handleChange('playSound')}
            class="toggle"
            bind:checked={activePreview.playSound}
            type="checkbox"
            name="sound"
            id=""
          />
        </label>
        <label for="osNotification" class="label uppercase">
          <span class="label-text">{$t('common.osNotification')}</span>
          <input
            on:change={async () => await handleChange('showOSNotification')}
            class="toggle"
            bind:checked={activePreview.showOSNotification}
            type="checkbox"
            name="osNotification"
            id=""
          />
        </label>
      </div>
    </form>
  {/if}
</Modal>
