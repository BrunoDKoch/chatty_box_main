<script lang="ts">
  import SkeletonUserAvatar from '../SkeletonUserAvatar.svelte';
</script>

<a href="/" on:click|preventDefault>
  <div class="flex flex-col gap-2">
    <div class="flex animate-pulse items-center bg-gray-300 dark:bg-gray-700 h-full" />
    <div class="grid grid-cols-8 w-80">
      <div class="col-span-1">
        <SkeletonUserAvatar size={25} />
      </div>
      <div class="col-span-7">
        <div class="w-full flex animate-pulse items-center bg-gray-300 dark:bg-gray-700 h-full" />
      </div>
    </div>
    <div class="flex animate-pulse items-center bg-gray-300 dark:bg-gray-700 h-full" />
  </div>
</a>
