<script lang="ts">
  export let icon: string;
  export let title: string;
</script>

<div class="flex max-w-[100vw] items-center justify-evenly">
  <iconify-icon
    class="row-span-2 self-center justify-self-center"
    {icon}
    height="5rem"
  />
  <h1 class="font-bold uppercase text-2xl">
    {title}
  </h1>
</div>
