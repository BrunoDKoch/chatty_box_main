<script lang="ts">
  import AdminAside from '$lib/components/Admin/AdminAside/AdminAside.svelte';
</script>


<div class="flex w-screen">
  <aside>
    <AdminAside />
  </aside>
  
  <main class="min-w-max flex-auto">
    <slot />
  </main>
</div>
