<script lang="ts">
  import Remove from "@components/buttons/Remove.svelte";

  import { holiday } from "@lib/database/schema";

  import { Button } from "@przkch/components/button";
  import { Input } from "@przkch/components/form";
  import { Table, Row, Cell } from "@przkch/components/table";

  import * as m from "@paraglide/messages";
  import { onMount } from "svelte";

  let fetched = $state(false);
  let holidays: (typeof holiday.$inferSelect)[] = $state([]);

  onMount(async () => {
    holidays = await fetch("/api/holidays").then((res) => {
      fetched = true;
      return res.json();
    });
  });

  const addHoliday = async (event: SubmitEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const response = await fetch("/api/holidays", { method: "POST", body: formData });
    const data: typeof holiday.$inferSelect = await response.json();

    if (response.status === 200) holidays.push(data[0]);

    holidays.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  };

  const editHoliday = async (event: SubmitEvent, holidayId: number) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    await fetch(`/api/holidays/${holidayId}/edit`, { method: "POST", body: formData });
  };

  const removeHoliday = async (event: SubmitEvent, holidayId: number) => {
    event.preventDefault();

    const response = await fetch(`/api/holidays/${holidayId}/delete`, { method: "POST" });

    if (response.status === 200) holidays = holidays.filter((h) => h.id !== holidayId);
  };
</script>

<form id="add_holiday" class="flex flex-col sm:flex-row gap-2 items-center" onsubmit={addHoliday}>
  <Input name="name" label={m.name()} type="text" class="w-full" />
  <Input name="date" label={m.date()} type="date" required class="w-full sm:w-fit" />
  <Button class="self-end" />
</form>

{#if !fetched}
  <p class="text-center">Ładowanie...</p>
{:else if !holidays.length}
  <span class="font-bold text-xl text-center">No custom holidays defined!</span>
{:else}
  <Table headers={[m.name(), m.date(), m.actions()]}>
    {#each holidays as holiday (holiday.id)}
      <Row>
        <Cell>
          <form onsubmit={(e) => editHoliday(e, holiday.id)}>
            <input
              type="text"
              name="name"
              value={holiday.name}
              class="bg-transparent"
              onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
            />
          </form>
        </Cell>
        <Cell>
          <form onsubmit={(e) => editHoliday(e, holiday.id)}>
            <input
              type="date"
              name="date"
              value={holiday.date}
              class="bg-transparent"
              onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
            />
          </form>
        </Cell>
        <Cell>
          <form onsubmit={(e) => removeHoliday(e, holiday.id)}>
            <Remove />
          </form>
        </Cell>
      </Row>
    {/each}
  </Table>
{/if}
