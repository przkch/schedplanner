<script lang="ts">
  import { Input, Submit, Select } from "@components/form";
  import Remove from "@components/buttons/Remove.svelte";
  import { group, team } from "@lib/database/schema";
  import type { employeeV } from "@lib/database/schema";

  import * as m from "@paraglide/messages";
  import { onMount } from "svelte";

  interface Props {
    teamId: number;
  }

  const { teamId }: Props = $props();

  let fetched = $state(false);
  let currentTeam: typeof team.$inferSelect | undefined = $state();
  let groups: (typeof group.$inferSelect)[] | undefined = $state();
  let employees: employeeV[] = $state([]);

  onMount(async () => {
    currentTeam = await fetch(`/api/teams/${teamId}`).then((res) => res.json());
    groups = await fetch(`/api/teams/${currentTeam?.id}/groups`).then((res) => res.json());
    employees = await fetch(`/api/teams/${currentTeam?.id}/employees`).then((res) => res.json());

    fetched = true;
  });

  const addEmployee = async (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const response = await fetch(`/api/teams/${currentTeam?.id}/employees`, { method: "POST", body: formData });
    const data: typeof group.$inferSelect = await response.json();

    if (response.status === 200) employees.push(data[0]);

    employees.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
  };

  const editEmployee = async (event: SubmitEvent, employeeId: number) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    await fetch(`/api/teams/${currentTeam?.id}/employees/${employeeId}/edit`, { method: "POST", body: formData });
  };

  const moveEmployee = async (event: SubmitEvent, employeeId: number) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    await fetch(`/api/teams/${currentTeam?.id}/employees/${employeeId}/move`, { method: "POST", body: formData });
  };

  const removeEmployee = async (event: SubmitEvent, employeeId: number) => {
    event.preventDefault();

    const response = await fetch(`/api/teams/${currentTeam?.id}/employees/${employeeId}/delete`, { method: "POST" });

    if (response.status === 200) employees = employees.filter((e) => e.id !== employeeId);
  };
</script>

<div class="flex flex-col gap-4">
  <h4 class="font-bold text-xl">{m.employees()}</h4>
  {#if !groups}
    <p class="text-center">Loading...</p>
  {:else}
    <form onsubmit={addEmployee} class="flex flex-row gap-2">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full">
        <Input name="first_name" placeholder={m.first_name()} type="text" required />
        <Input name="last_name" placeholder={m.last_name()} type="text" required />

        <Select name="group_id" required>
          {#each groups as group (group.id)}
            <option value={group.id}>{group.name}</option>;
          {/each}
        </Select>
      </div>
      <Submit disabled={groups.length === 0} />
    </form>
  {/if}

  {#if !employees || !groups}
    <p>Loading...</p>
  {:else if !employees?.length}
    <span class="font-bold text-xl text-center">{m.no_employees()}</span>
  {:else}
    <div class="rounded-xl">
      <table class="w-full text-sm text-left rtl:text-right">
        <thead class="text-xs bg-stone-100 dark:bg-stone-900">
          <tr>
            <th class="px-6 py-3">{m.first_name()}</th>
            <th class="px-6 py-3">{m.last_name()}</th>
            <th class="px-6 py-3">{m.group()}</th>
            <th class="px-6 py-3">{m.actions()}</th>
          </tr>
        </thead>
        <tbody>
          {#each employees as employee (employee.id)}
            <tr class="even:bg-stone-200 dark:even:bg-stone-900">
              <td class="px-6 py-4">
                <form onsubmit={(e) => editEmployee(e, employee.id)} class="flex flex-row justify-between items-center gap-4">
                  <input
                    type="text"
                    name="first_name"
                    value={employee.firstName}
                    class="bg-transparent w-full"
                    autocomplete="off"
                    onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
                  />
                </form>
              </td>
              <td class="px-6 py-4">
                <form onsubmit={(e) => editEmployee(e, employee.id)} class="flex flex-row justify-between items-center gap-4">
                  <input
                    type="text"
                    name="last_name"
                    value={employee.lastName}
                    class="bg-transparent w-full"
                    autocomplete="off"
                    onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
                  />
                </form>
              </td>
              <td>
                <form onsubmit={(e) => moveEmployee(e, employee.id)} class="flex flex-row justify-between items-center gap-4">
                  <select
                    name="group_id"
                    onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
                    class="block w-full px-4 py-2 text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 border rounded-md focus:outline-none disabled:opacity-75"
                  >
                    {#each groups as group (group.id)}
                      <option value={group.id} selected={group.id === employee.groupId}>
                        {group.name}
                      </option>
                    {/each}
                  </select>
                </form>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-row gap-2 justify-end">
                  <form onsubmit={(e) => removeEmployee(e, employee.id)}>
                    <Remove />
                  </form>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
