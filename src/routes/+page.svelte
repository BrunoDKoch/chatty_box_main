<script lang="ts">
  import Aside from '$lib/components/Aside/Aside.svelte';
  import { HubConnectionState } from '@microsoft/signalr';
  import { connection, previews, messagesCount, online } from '$lib/useSignalR';
  import { onDestroy, onMount } from 'svelte';
  import FriendsTabs from '$lib/components/FriendsTabs/FriendsTabs.svelte';
  import ActiveScreen from '$lib/components/MainScreen/ActiveScreen.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { locale, t } from 'svelte-i18n';
  import NotificationToast from '$lib/components/Notification/NotificationToast.svelte';
  import useUserNotificationSettings from '$lib/useUserNotificationSettings';
  import ConnectingComponent from '$lib/components/ConnectingComponent.svelte';
  $: notifications = [] as { notificationType: 'message' | 'friend request'; text: string }[];
  connection.on('newMessage', async (data: MessageResponse) => {
    previews.update((p) => {
      const existingChat = p.find((c) => c.id === data.chatId);
      if (existingChat) {
        const { sentAt, text } = data;
        existingChat.lastMessage = { from: data.user, sentAt, text, read: data.isFromCaller };
      }
      return p;
    });
    if (data.isFromCaller) return;
    $messagesCount++;
    var audio = new Audio('/sounds/newMessage.mp3');
    if ($useUserNotificationSettings?.playSound) await audio.play();
    if (document.hidden && $useUserNotificationSettings?.showOSNotification)
      new Notification(`ChattyBox: ${$t('common.new.f')} ${$t('common.message')}`, {
        body: `${data.user.userName}: ${data.text.slice(0, 240)}`,
        lang: $locale!,
      });
    else {
      notifications.push({
        notificationType: 'message',
        text: `${data.user.userName}: ${data.text.slice(0, 240)}`,
      });
      notifications = notifications;
    }
  });

  onMount(async () => {
    await Notification.requestPermission();
    if (connection.state === HubConnectionState.Disconnected) await connection.start();
    await connection.invoke('GetChatPreviews');
    await connection.invoke('GetFriends');
    await connection.invoke('GetFriendRequests');
    await connection.invoke('GetNotificationSettings');
  });
  onDestroy(async () => {
    await connection.stop();
  });
</script>

{#if $online}
  <title>{$messagesCount ? `(${$messagesCount}) ` : ''}ChattyBox</title>
  <div class="grid grid-cols-4 w-screen">
    <aside class="col-span-1 bg-base-200 h-screen">
      <Aside chats={$previews} />
    </aside>
    <section class="col-span-3 overflow-x-hidden">
      <ActiveScreen />
    </section>
  </div>

  <div>
    {#each notifications as notification}
      <div class="toast toast-top toast-center">
        <NotificationToast
          on:close={() => {
            notifications = notifications.filter((n) => n !== notification);
            notifications = notifications;
          }}
          {...notification}
        />
      </div>
    {/each}
  </div>
{:else}
  <ConnectingComponent />
{/if}
