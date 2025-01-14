<script lang="ts">
  import { Input, Submit } from "@components/form";
  import { Table, Row, Cell } from "@components/table";
  import Remove from "@components/buttons/Remove.svelte";
  import { group, team } from "@lib/database/schema";

  import * as m from "@paraglide/messages";
  import { onMount } from "svelte";

  interface Props {
    teamId: number;
  }

  const { teamId }: Props = $props();

  let fetched = $state(false);
  let currentTeam: typeof team.$inferSelect | undefined = $state();
  let groups: (typeof group.$inferSelect)[] = $state([]);

  onMount(async () => {
    currentTeam = await fetch(`/api/teams/${teamId}`).then((res) => res.json());
    groups = await fetch(`/api/teams/${currentTeam?.id}/groups`).then((res) => {
      fetched = true;
      return res.json();
    });
  });

  const addGroup = async (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const response = await fetch(`/api/teams/${currentTeam?.id}/groups`, { method: "POST", body: formData });
    const data: typeof group.$inferSelect = await response.json();

    if (response.status === 200) groups.push(data[0]);

    groups.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  };

  const editGroup = async (event: SubmitEvent, groupId: number) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    await fetch(`/api/teams/${currentTeam?.id}/groups/${groupId}/edit`, { method: "POST", body: formData });
  };

  const removeGroup = async (event: SubmitEvent, groupId: number) => {
    event.preventDefault();

    const response = await fetch(`/api/teams/${currentTeam?.id}/groups/${groupId}/delete`, { method: "POST" });

    if (response.status === 200) groups = groups.filter((g) => g.id !== groupId);
  };
</script>

<div class="flex flex-col gap-4">
  <h3 class="font-bold text-3xl">
    {#if !currentTeam}
      Loading...
    {:else}
      {m.team_name({ name: currentTeam.name })}
    {/if}
  </h3>
  <h4 class="font-bold text-xl">{m.groups()}</h4>
  <form onsubmit={addGroup} class="flex flex-row gap-2">
    <Input name="name" placeholder={m.name()} type="text" required class="w-full" />
    <Submit />
  </form>
  {#if !fetched}
    <p class="text-center">Loading...</p>
  {:else if !groups?.length}
    <span class="font-bold text-xl text-center">{m.no_groups()}</span>
  {:else}
    <Table headers={[m.name(), m.actions()]}>
      {#each groups as group (group.id)}
        <Row>
          <Cell>
            <form onsubmit={(e) => editGroup(e, group.id)} class="flex flex-row justify-between items-center gap-4">
              <input
                type="text"
                name="group_name"
                value={group.name}
                class="bg-transparent w-full"
                autocomplete="off"
                onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
              />
            </form>
          </Cell>
          <Cell>
            <form onsubmit={(e) => removeGroup(e, group.id)}>
              <Remove />
            </form>
          </Cell>
        </Row>
      {/each}
    </Table>
  {/if}
</div>
