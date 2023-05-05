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
  import useActiveScreen from '$lib/useActiveScreen';
    import { chat } from '$lib/useActiveChat';
  $: notifications = [] as {
    notificationType: 'message' | 'friend request';
    text: string;
    userName: string;
  }[];

  // Handle a new message
  connection.on('newMessage', async (data: MessageResponse) => {
    previews.update((p) => {
      const existingChat = p.find((c) => c.id === data.chatId);
      // Change latest msg in existing chat
      if (existingChat) {
        const { sentAt, text } = data;
        existingChat.lastMessage = { from: data.user, sentAt, text, read: data.isFromCaller };
      }
      return p;
    });
    chat.update((ch) => {
      if (ch.id !== data.chatId || ch.messages.includes(data)) return ch;
      ch.messages.push(data);
      return ch;
    })
    // Stop here if it's from the user
    if (data.isFromCaller) return;
    // Add to unread messages count
    $messagesCount++;
    var audio = new Audio('/sounds/newMessage.mp3');
    if ($useUserNotificationSettings?.playSound) await audio.play();
    // Show OS notification if window is unfocused
    if (document.hidden && $useUserNotificationSettings?.showOSNotification)
      new Notification(
        `ChattyBox: ${$t('common.new.f')} ${$t('common.message', { values: { count: 1 } })}`,
        {
          body: `${data.user.userName}: ${data.text.slice(0, 240)}`,
          lang: $locale!,
        },
      );
    // Else, show notification toast
    else {
      notifications.push({
        notificationType: 'message',
        userName: data.user.userName,
        text: data.text.slice(0, 240),
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
  <div class="lg:grid lg:grid-cols-4 w-screen">
    <aside class="col-span-1 bg-base-200 h-screen max-md:hidden">
      <Aside chats={$previews} />
    </aside>
    <div class="lg:hidden flex bg-base-200 z-50">
      <button
        on:click={() => ($useActiveScreen = $useActiveScreen === 'aside' ? 'friends' : 'aside')}
        class="btn btn-ghost text-4xl"
      >
        <iconify-icon icon="mdi:menu" />
      </button>
    </div>
    <section class="lg:col-span-3 overflow-x-hidden">
      <ActiveScreen />
    </section>
  </div>

  <div>
    {#each notifications as notification}
      <div class="toast toast-top toast-center w-[50vw] z-50">
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
