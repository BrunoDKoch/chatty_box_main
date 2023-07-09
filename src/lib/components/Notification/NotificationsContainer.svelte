<script lang="ts">
  import NotificationToast from './NotificationToast.svelte';

  export let notifications: {
    notificationType: 'message' | 'friend request';
    text: string;
    userName: string;
    action?: string;
  }[];
</script>

<div class="toast toast-top toast-center w-[50dvw] z-50">
  {#each notifications as notification}
    <NotificationToast
      on:close={() => {
        notifications = notifications.filter((n) => n !== notification);
        notifications = notifications;
      }}
      {...notification}
    />
  {/each}
</div>
