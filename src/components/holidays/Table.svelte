<script lang="ts">
  import { holiday } from "@lib/database/schema";
  import Remove from "@components/buttons/Remove.svelte";
  import HTMLInput from "@components/form/HTMLInput.svelte";
  import HTMLSubmit from "@components/form/HTMLSubmit.svelte";

  import Icon from "@iconify/svelte";
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
  <HTMLInput name="name" label={m.name()} type="text" class="w-full" />
  <HTMLInput name="date" label={m.date()} type="date" required class="w-full sm:w-fit" />
  <HTMLSubmit label={m.add()} class="self-end" type="submit" />
</form>

{#if !fetched}
  <p class="text-center">Ładowanie...</p>
{:else if !holidays.length}
  <span class="font-bold text-xl text-center">No custom holidays defined!</span>
{:else}
  <table class="w-full text-sm text-left rtl:text-right">
    <thead class="text-xs bg-stone-100 dark:bg-stone-900">
      <tr>
        <th class="px-6 py-3">
          <div class="flex flex-row gap-2 items-center">
            <span>{m.name()}</span>
            <Icon icon="mdi:edit" />
          </div>
        </th>
        <th class="px-6 py-3">
          <div class="flex flex-row gap-2 items-center">
            <span>{m.date()}</span>
            <Icon icon="mdi:edit" />
          </div>
        </th>
        <th class="px-6 py-3">{m.actions()}</th>
      </tr>
    </thead>

    <tbody>
      {#each holidays as holiday (holiday.id)}
        <tr class="even:bg-stone-200 dark:even:bg-stone-900">
          <td class="px-4">
            <form onsubmit={(e) => editHoliday(e, holiday.id)}>
              <input
                type="text"
                name="name"
                value={holiday.name}
                class="bg-transparent"
                onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
              />
            </form>
          </td>
          <td class="px-4">
            <form onsubmit={(e) => editHoliday(e, holiday.id)}>
              <input
                type="date"
                name="date"
                value={holiday.date}
                class="bg-transparent"
                onchange={(e) => (e.currentTarget.parentElement as HTMLFormElement).requestSubmit()}
              />
            </form>
          </td>
          <td class="px-4 py-2">
            <div class="flex flex-row gap-2 items-center">
              <form onsubmit={(e) => removeHoliday(e, holiday.id)}>
                <Remove />
              </form>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
