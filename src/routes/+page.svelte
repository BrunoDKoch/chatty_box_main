<script lang="ts">
  import Aside from '$lib/components/Aside/Aside.svelte';
  import { HubConnectionState } from '@microsoft/signalr';
  import { connection, previews, messagesCount, online } from '$lib/useSignalR';
  import { onDestroy, onMount } from 'svelte';
  import ActiveScreen from '$lib/components/MainScreen/ActiveScreen.svelte';
  import type { MessageResponse } from '$lib/types/combinationTypes';
  import { locale, t } from 'svelte-i18n';
  import NotificationToast from '$lib/components/Notification/NotificationToast.svelte';
  import useUserNotificationSettings from '$lib/useUserNotificationSettings';
  import ConnectingComponent from '$lib/components/ConnectingComponent.svelte';
  import useActiveScreen from '$lib/useActiveScreen';
  import { chat } from '$lib/useActiveChat';
  import type { UserPartialResponse } from '$lib/types/partialTypes';
  import { checkIfLoggedIn, accessToken } from '$lib/useAuth';
  import ErrorModal from '$lib/components/Modals/ErrorModal.svelte';

  let error: { status: number; cause: string; message: string } | null = null;

  $: title = 'ChattyBox';
  $: {
    if ($online) title = $messagesCount ? `(${$messagesCount}) ${title}` : title;
  }

  $: notifications = [] as {
    notificationType: 'message' | 'friend request';
    text: string;
    userName: string;
    action?: string;
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
    else {
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
    error = {
      status: 500,
      cause: $t('error.cause.signalR'),
      message: `${$t('error.signalR', { values: { error: data } })}\n ${$t('error.ourEnd')}\n ${$t(
        'error.contactSupport',
      )}`,
    };
  });

  onMount(async () => {
    setTimeout(async () => {
      try {
        if (connection.state !== HubConnectionState.Connected) {
          await connection.start();
        }
        await Notification.requestPermission();
        $online = connection.state === HubConnectionState.Connected;
        await connection.invoke('InitialCall');
      } catch (err) {
        error = {
          status: 503,
          cause: $t('error.cause.503'),
          message: `${$t('error.signalR', {
            values: { error: (err as { message: string }).message },
          })}\n ${$t('error.ourEnd')}\n ${$t('error.contactSupport')}`,
        };
      }
    }, 100);
    accessToken.read();
    await checkIfLoggedIn();
    setInterval(async () => {
      await checkIfLoggedIn();
    }, 300000);
  });
  onDestroy(async () => {
    await connection.stop();
  });
</script>

<title>{title}</title>
{#if $online}
  <div class="lg:grid lg:grid-cols-4 max-md:flex max-md:flex-col w-screen overflow-hidden">
    <aside class="col-span-1 min-h-screen max-md:hidden">
      <Aside />
    </aside>
    <div class="lg:hidden flex items-center bg-base-200 z-50">
      <button
        on:click={() => ($useActiveScreen = $useActiveScreen === 'aside' ? 'friends' : 'aside')}
        class="btn btn-ghost text-4xl"
      >
        <iconify-icon icon="mdi:menu" />
      </button>
      {#if $useActiveScreen === 'chat' && $chat}
        <h1 class="font-bold text-2xl">{$chat.chatName ?? $chat.users.map((u) => u.userName).join(', ')}</h1>
      {/if}
    </div>
    <section class="lg:col-span-3 max-h-screen overflow-hidden">
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

{#if error}
  <ErrorModal {error} on:close={() => (error = null)} />
{/if}
