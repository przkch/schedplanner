<script lang="ts">
  import type { team } from "@lib/database/schema";

  import * as m from "@paraglide/messages";
  import { onMount } from "svelte";

  let teams: (typeof team.$inferSelect)[] | null = $state(null);
  let currentTeam: typeof team.$inferSelect | undefined = $state();

  onMount(async () => {
    teams = await fetch("/api/teams").then((res) => res.json());
    currentTeam = await fetch("/api/teams/current").then((res) => res.json());
  });

  const onchange = async () => {
    const form = document.querySelector("form") as HTMLFormElement;

    const formData = new FormData(form);

    await fetch("/api/teams/current", { method: "POST", body: formData });

    window.location.reload();
  };
</script>

{#if !teams || !currentTeam?.id}
  <p>Loading...</p>
{:else if teams.length === 0}
  <span class="font-bold">{m.no_teams()}</span>
{:else}
  <form class="flex flex-col gap-2 max-w-32 sm:max-w-none">
    <select name="chosen_team" {onchange} required class="bg-inherit">
      {#each teams as team (team.id)}
        <option value={team.id} selected={team.id === currentTeam.id}>
          {team.name}
        </option>
      {/each}
    </select>
  </form>
{/if}
