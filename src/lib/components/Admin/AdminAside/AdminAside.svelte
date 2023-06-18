<script lang="ts">
  const links = [
    {
      name: 'Pending reports',
      link: '/admin',
    },
    {
      name: 'Past reports',
      link: '/admin/past',
    },
    {
      name: 'Suspended users',
      link: '/admin/suspensions',
    },
  ];
</script>

<ul class="menu">
  {#each links as link}
    <li>
      <a href={link.link}>
        {link.name}
      </a>
    </li>
  {/each}
</ul>
