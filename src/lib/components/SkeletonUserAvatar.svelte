<script lang="ts">
  export let size: number | 'half' | 'full';
  export let isChatImage = false;
  export let lowerOpacity = false;
  let { className, rawSize } = getWidthAndHeight();
  function getWidthAndHeight() {
    switch (size) {
      case 'full':
        return { className: 'w-24 h-24', rawSize: 150 };
      case 'half':
        return { className: 'w-12 h-12', rawSize: 75 };
      default:
        return {
          className: size <= 25 ? 'w-6 h-6' : 'w-12 h-12',
          rawSize: size,
        };
    }
  }
</script>

<figure
  class="avatar 'placeholder' cursor-pointer mask mask-squircle {lowerOpacity
    ? 'opacity-50'
    : 'opacity-100'} {className} {isChatImage ? 'chat-image' : ''}"
>
  <div class="w-[{rawSize}px] rounded-lg">
    <div class="flex animate-pulse items-center bg-gray-300 dark:bg-gray-700 h-full" />
  </div>
</figure>
