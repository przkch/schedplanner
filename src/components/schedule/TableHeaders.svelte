<script lang="ts">
  import { holiday } from "@lib/database/schema";
  import { getDays } from "@lib/utils/date";

  import * as m from "@paraglide/messages";

  interface Props {
    holidays: (typeof holiday.$inferSelect)[];
    year: number;
    month: number;
    footer?: boolean;
  }

  const { holidays, year, month, footer = false }: Props = $props();

  const days = getDays(year, month, holidays, window.navigator.language);
</script>

<tr>
  <td class="font-bold text-left px-4 border-1">
    {#if !footer}
      {m.employees()}
    {:else}
      {m.counts_on_shifts()}
    {/if}
  </td>
  {#each days as day}
    <td
      class={[
        "text-center border-1",
        {
          "bg-custom-holiday text-gray-100": day.isFree,
          "bg-gray-300 text-gray-800": day.isToday,
          "bg-gray-50 text-gray-800": !day.isFree && !day.isToday,
        },
      ]}
      title={day.customHolidayName}
    >
      {day.idx}
      <br />
      <span class="text-[0.75rem]">{day.shortDay}</span>
    </td>
  {/each}
  {#if !footer}
    <td class="px-2 border-1">{m.total_hours()}</td>{/if}
</tr>
