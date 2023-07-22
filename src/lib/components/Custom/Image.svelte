<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;
  export let alt: string;
  export let width: number | undefined = undefined;
  export let additionalClasses = '';

  let imageStatus: 'error' | 'loading' | 'ok' = 'loading';

  function getWidthClassWhenLoading() {
    if (!width) return 'w-[600px] h-[330px] min-w-[600px]';
    if (width > 100) return `w-[${width}px] h-[125px] min-w-[${width}px]`;
    return `w-[${width}px] h-[${width}px] min-w-[${width}px]`;
  }

  onMount(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => (imageStatus = 'ok');
    img.onerror = () => (imageStatus = 'error');
  });
</script>

{#if imageStatus === 'ok'}
  <img
    on:load={() => (imageStatus = 'ok')}
    on:error={() => (imageStatus = 'error')}
    {src}
    {width}
    class="{additionalClasses} {width ? `w-[${width}px] min-w-[${width}px]` : ''}"
    loading="lazy"
    {alt}
  />
{:else}
  <div
    class="box-border grid grid-cols-1 grid-rows-1 place-items-center {additionalClasses} {getWidthClassWhenLoading()}"
    class:error-bg={imageStatus === 'error'}
    class:loading-bg={imageStatus === 'loading'}
  >
    <iconify-icon
      class:text-6xl={!width || width > 75}
      class:text-4xl={width && width <= 75 && width > 25}
      class:text-xl={width && width <= 25}
      class="text-white"
      icon={imageStatus === 'loading' ? 'mdi:image' : 'material-symbols:error'}
    />
  </div>
{/if}

<style lang="postcss">
  .loading-bg {
    @apply animate-pulse bg-cyan-300 dark:bg-cyan-800;
  }
  .error-bg {
    @apply bg-error dark:bg-error-content;
  }
</style>
