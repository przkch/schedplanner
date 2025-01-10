<script lang="ts">
  import TeamPicker from "@components/TeamPicker.svelte";

  import * as m from "@paraglide/messages";

  import Icon from "@iconify/svelte";

  const links = [
    { href: "/teams", title: m.teams(), icon: "mdi:people" },
    { href: "/shifts", title: m.shifts(), icon: "mdi:clock" },
    { href: "/holidays", title: m.holidays(), icon: "mdi:calendar-edit" },
  ];
</script>

<div class="flex flex-row gap-4 items-center justify-between p-2 px-4 bg-gray-100">
  <div class="flex flex-row items-center gap-4">
    <h1><button><a href="/">{m.navbar_title()}</a></button></h1>
    <TeamPicker />
  </div>
  <ul class="flex flex-row gap-2">
    {#each links as link}
      <li>
        <button>
          <a href={link.href} class="flex flex-row items-center gap-2">
            <Icon icon={link.icon} class="text-xl" />
            <span class="hidden lg:block">{link.title}</span>
          </a>
        </button>
      </li>
    {/each}
  </ul>
</div>
