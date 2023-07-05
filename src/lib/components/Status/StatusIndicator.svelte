<script lang="ts">
  export let status: string | undefined = undefined;
  export let isOnline = false;
  export let direction: 'start' | 'end' = 'start'
  let { icon, className } = getIconAndClass();
  $: status, ({ icon, className } = getIconAndClass());
  $: isOnline, ({ icon, className } = getIconAndClass());
  function getIconAndClass() {
    switch (status) {
      case 'busy':
        return {
          icon: 'material-symbols:do-not-disturb-on-outline',
          className: 'badge badge-error',
        };
      case 'away':
        return {
          icon: 'fluent:presence-away-10-regular',
          className: 'badge badge-warning',
        };
      default:
        if (isOnline)
          return {
            icon: '',
            className: 'badge badge-success',
          };
        return {
          icon: '',
          className: '',
        };
    }
  }
</script>

{#if isOnline}
  <span class="indicator-item indicator-{direction} rounded-full max-w-fit max-h-fit z-50 {className}">
    {#if icon}
      <iconify-icon {icon} />
    {/if}
  </span>
{/if}
