<script lang="ts">
  import TeamPicker from "@components/layout/TeamPicker.svelte";
  import UserIcon from "@components/ui/UserIcon.svelte";
  import Dialog from "@components/ui/Dialog.svelte";

  import type { Session } from "@auth/core/types";
  import * as m from "@paraglide/messages";
  import Icon from "@iconify/svelte";

  interface Props {
    session: Session;
  }

  const { session }: Props = $props();

  const links = [
    { href: "/teams", title: m.teams(), icon: "mdi:people" },
    { href: "/shifts", title: m.shifts(), icon: "mdi:clock" },
    { href: "/holidays", title: m.holidays(), icon: "mdi:calendar-edit" },
  ];
</script>

<div class="flex flex-row gap-4 items-center justify-between p-2 px-4 bg-stone-100 dark:bg-stone-900">
  <div class="flex flex-row items-center gap-4">
    <h1><button><a href="/">{m.navbar_title()}</a></button></h1>
    <TeamPicker />
  </div>

  <button
    onclick={() => {
      const dialog = document.querySelector("dialog") as HTMLDialogElement;
      dialog.showModal();
    }}
  >
    {#if session}
      <UserIcon name={session?.user?.name} />
    {/if}
  </button>

  <Dialog class="mr-0 mt-14 rounded-xl p-4 w-[60vw] max-w-[300px]">
    <div class="flex flex-col gap-6">
      <div class="flex flex-row gap-2 items-center justify-between">
        <div class="flex flex-row gap-2 items-center">
          {#if session}
            <UserIcon name={session?.user?.name} />
            <span>{session.user?.name}</span>
          {/if}
        </div>
        <button>
          <a href="/api/auth/signout">
            <Icon icon="mdi:logout" class="text-xl" />
          </a>
        </button>
      </div>

      <ul class="flex flex-col gap-2">
        {#each links as link}
          <li>
            <button>
              <a href={link.href} class="flex flex-row items-center gap-2">
                <Icon icon={link.icon} class="text-xl" />
                <span>{link.title}</span>
              </a>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </Dialog>
</div>
