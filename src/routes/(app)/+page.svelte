<script lang="ts">
  import Aside from '$lib/components/Aside/Aside.svelte';
  import { connection, previews, messagesCount, online } from '$lib/useSignalR';
  import { onMount } from 'svelte';
  import ActiveScreen from '$lib/components/MainScreen/ActiveScreen.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { locale, t } from 'svelte-i18n';
  import useUserNotificationSettings from '$lib/useUserNotificationSettings';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chat } from '$lib/useActiveChat';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import NotificationsContainer from '$lib/components/Notification/NotificationsContainer.svelte';
  import useError from '$lib/useError';
  import useUserModal from '$lib/useUserModal';
  import UserModal from '$lib/components/Modals/UserModal.svelte';
  import Button from '$lib/components/Custom/Button.svelte';
  import MainHeader from '$lib/components/Header/MainHeader.svelte';
  import { messageFiles } from '$lib/useMessageFiles';

  $: title = 'ChattyBox';
  $: {
    if ($online) title = $messagesCount ? `(${$messagesCount}) ChattyBox` : 'ChattyBox';
  }

  $: notifications = [] as {
    notificationType: 'message' | 'friend request';
    text: string;
    userName: string;
    action?: string;
  }[];

  messageFiles.init();

  // Handle a new message
  connection.on('newMessage', async (data: MessageResponse) => {
    previews.update((p) => {
      const existingChat = p.find((c) => c.id === data.chatId);
      // Change latest msg in existing chat
      if (existingChat) {
        const { sentAt, text } = data;
        existingChat.lastMessage = { from: data.user, sentAt, text, read: data.isFromCaller };
      }
      p.sort((a, b) => {
        if (a.lastMessage && b.lastMessage)
          return Number(new Date(b.lastMessage.sentAt)) - Number(new Date(a.lastMessage.sentAt));
        return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
      });
      return p;
    });
    chat.update((ch) => {
      if (ch.id !== data.chatId || !!ch.messages.find((m) => m.id === data.id)) return ch;
      ch.messages.push(data);
      return ch;
    });
    // Stop here if it's from the user
    if (data.isFromCaller) return;

    // Add to unread messages count
    if ($chat.id !== data.chatId) $messagesCount++;

    // Play audio if appropriate
    var audio = new Audio('/sounds/newMessage.mp3');
    if ($previews.find((p) => p.id === data.chatId)?.playSound) {
      if ($chat.id === data.chatId || !document.hidden) return;
      await audio.play();
    }
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
    else if ($useUserNotificationSettings?.showAlert) {
      notifications.push({
        notificationType: 'message',
        userName: data.user.userName,
        text: data.text.slice(0, 240),
        action: data.chatId,
      });
      notifications = notifications;
    }
  });

  connection.on('newFriendRequest', async (data: { userAdding: UserPartialResponse }) => {
    notifications.push({
      notificationType: 'friend request',
      userName: data.userAdding.userName,
      text: 'sent a friend request',
    });
    notifications = notifications;
    var audio = new Audio('/sounds/newMessage.mp3');
    if ($useUserNotificationSettings?.playSound) await audio.play();
    await connection.invoke('GetFriendRequests');
  });

  connection.on('error', (data: string) => {
    $useError = {
      status: 500,
      cause: $t('error.cause.signalR'),
      message: `${$t('error.signalR', { values: { error: data } })}\n ${$t('error.ourEnd')}\n ${$t(
        'error.contactSupport',
      )}`,
    };
  });

  onMount(async () => {
    await Notification.requestPermission();
  });
</script>

<title>{title}</title>

<div class="lg:grid lg:grid-cols-4 max-lg:flex max-lg:flex-col w-screen h-full overflow-hidden">
  <aside class="col-span-1 max-h-full max-lg:hidden">
    <Aside />
  </aside>
  <MainHeader />
  <section class="lg:col-span-3 h-full overflow-hidden">
    <ActiveScreen />
  </section>
</div>

<NotificationsContainer bind:notifications />

{#if $useUserModal}
  <UserModal on:close={() => ($useUserModal = null)} user={$useUserModal} />
{/if}
