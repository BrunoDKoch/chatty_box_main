<script lang="ts">
  import SkeletonUserAvatar from './SkeletonUserAvatar.svelte';
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  export let lowerOpacity = false;
</script>

<div class="grid max-lg:grid-cols-3 lg:grid-cols-5 lg:gap-3 items-center">
  <SkeletonUserAvatar {size} {isChatImage} {lowerOpacity} />
  <div class="lg:col-span-3 flex flex-col {lowerOpacity ? 'opacity-50' : 'opacity-100'}">
    <div class="w-36 h-6 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700" />
  </div>
  <slot />
</div>
