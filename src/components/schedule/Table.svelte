<script lang="ts">
  import HTMLSubmit from "@components/form/HTMLSubmit.svelte";
  import TableHeaders from "@components/schedule/TableHeaders.svelte";
  import { group, holiday, shift } from "@lib/database/schema";
  import type { EmployeesSchedule, employeeV } from "@lib/database/schema";
  import { fmtShift } from "@lib/utils";
  import { getDays } from "@lib/utils/date";
  import type { Days } from "@lib/utils/date";

  import * as m from "@paraglide/messages";
  import { onDestroy, onMount } from "svelte";
  import type { Action } from "svelte/action";

  interface Props {
    teamId: number;
    year: number;
    month: number;
  }

  const { teamId, year, month }: Props = $props();

  let employees: employeeV[] = $state([]);
  let groups: (typeof group.$inferSelect)[] | undefined = $state();
  let holidays: (typeof holiday.$inferSelect)[] = $state([]);
  let shifts: (typeof shift.$inferSelect)[] | undefined = $state();

  let employeesSchedule: EmployeesSchedule[] = $state([]);
  let fullSchedule = $state({});
  let totalHours = $state({});
  let shiftCounts = $state({});

  let days: Days[] = $state([]);

  let scheduleEventSource: EventSource | null = null;

  interface Selectable {
    x: number;
    y: number;
    width: number;
    height: number;
    elem?: HTMLElement;
  }

  const selectables: Selectable[] = [];

  const addSelectable: Action = (node) => {
    $effect(() => {
      const { x, y, width, height } = node.getBoundingClientRect();
      selectables.push({ x: x + window.scrollX, y: y + window.scrollY, width, height, elem: node });
      node.dataset.isSelectable = "true";
    });
  };

  function checkSelected(selectables: Selectable[], selectAreaElem: Element) {
    const { x, y, height, width } = selectAreaElem.getBoundingClientRect();

    for (const selectable of selectables) {
      if (checkRectIntersection({ x: x + window.scrollX, y: y + window.scrollY, height, width }, selectable)) {
        selectable.elem?.classList.add("intersected");
      } else {
        selectable.elem?.classList.remove("intersected");
      }
    }
  }

  const checkRectIntersection = (r1: Selectable, r2: Selectable): boolean => {
    return !(r1.x + r1.width < r2.x || r2.x + r2.width < r1.x || r1.y + r1.height < r2.y || r2.y + r2.height < r1.y);
  };

  const generateFullSchedule = async () => {
    employeesSchedule = await fetch(`/api/teams/${teamId}/schedule/${year}/${month}`).then((res) => res.json());

    fullSchedule = {};
    totalHours = {};
    shiftCounts = {};

    for (const s of employeesSchedule) {
      if (!(s.employeeId in fullSchedule)) {
        fullSchedule[s.employeeId] = {};
      }

      if (!s.shiftId || !s.start || !s.end || !s.color) {
        continue;
      }

      fullSchedule[s.employeeId][s.day] = {
        label: s.label,
        start: fmtShift(s.start),
        end: fmtShift(s.end),
        color: s.color,
        shiftType: s.shiftType,
      };

      if (!["VACATION", "LEAVE_ON_REQUEST"].includes(s.shiftType as unknown as string)) {
        if (!(s.employeeId in totalHours)) {
          totalHours[s.employeeId] = 0;
        }

        const shiftDuration =
          Math.abs(Date.parse(`${s.year}-${s.month}-${s.day} ${s.end}`) - Date.parse(`${s.year}-${s.month}-${s.day} ${s.start}`)) / (60 * 60 * 1000);

        totalHours[s.employeeId] += shiftDuration;
      }

      if (!(s.shiftId in shiftCounts)) {
        shiftCounts[s.shiftId] = {};
      }

      if (!(s.day in shiftCounts[s.shiftId])) {
        shiftCounts[s.shiftId][s.day] = 0;
      }

      if (!("total" in shiftCounts[s.shiftId])) {
        shiftCounts[s.shiftId].total = 0;
      }

      shiftCounts[s.shiftId][s.day] += 1;
      shiftCounts[s.shiftId].total += 1;
    }
  };

  onMount(async () => {
    employees = await fetch(`/api/teams/${teamId}/employees`).then((res) => res.json());
    groups = await fetch(`/api/teams/${teamId}/groups`).then((res) => res.json());
    holidays = await fetch(`/api/holidays/year/${year}`).then((res) => res.json());
    shifts = await fetch("/api/shifts").then((res) => res.json());

    await generateFullSchedule();

    days = getDays(year, month, holidays);

    const scheduleTable = document.querySelector("table") as HTMLTableElement;
    const tableContainer = scheduleTable.parentElement as HTMLDivElement;
    const modifyScheduleElement = document.querySelector("dialog#modify_schedule") as HTMLDialogElement;
    const employeeIdElement = modifyScheduleElement.querySelector("input[name='employee_id']") as HTMLInputElement;
    const dayElement = modifyScheduleElement.querySelector("input[name='day']") as HTMLInputElement;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (event.button !== 0) return;

      if (!(target.dataset.isSelectable === "true") && !target.classList.contains("intersected")) return;

      event.preventDefault();

      const x = event.pageX + tableContainer.scrollLeft;
      const y = event.pageY + tableContainer.scrollTop;

      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.width = "0";
      div.style.height = "0";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.classList.add("drag-select");
      document.body.append(div);

      const resize = (event: PointerEvent) => {
        const diffX = event.pageX + tableContainer.scrollLeft - x;
        const diffY = event.pageY + tableContainer.scrollTop - y;
        div.style.left = diffX < 0 ? x + diffX + "px" : x + "px";
        div.style.top = diffY < 0 ? y + diffY + "px" : y + "px";
        div.style.height = Math.abs(diffY) + "px";
        div.style.width = Math.abs(diffX) + "px";
        checkSelected(selectables, div);
      };

      const employees: number[] = [];
      const days: number[] = [];

      target.classList.add("intersected");

      resize(event);

      const employee = Number(target.dataset.employee);
      const day = Number(target.dataset.day);

      !employees.includes(employee) && employees.push(employee);
      !days.includes(day) && days.push(day);

      selectables.forEach((item) => item.elem?.classList.remove("intersected"));

      const handlePointerMove = (event: PointerEvent) => {
        resize(event);

        const intersectedElements = [...(document.querySelectorAll(".intersected") as NodeListOf<HTMLElement>)];

        if (intersectedElements.length) {
          intersectedElements.map((elem) => {
            const employee = Number(elem.dataset.employee);
            const day = Number(elem.dataset.day);

            !employees.includes(employee) && employees.push(employee);
            !days.includes(day) && days.push(day);
          });
        }
      };

      document.addEventListener("pointermove", handlePointerMove);

      const handlePointerUp = (event: PointerEvent) => {
        const target = event.target as HTMLElement;

        if (event.button !== 0) return;

        removeEventListener("pointermove", handlePointerMove);

        div.remove();
        selectables.forEach((item) => item.elem?.classList.remove("intersected"));

        if (!(target.dataset.isSelectable === "true") && !target.classList.contains("intersected")) return;

        if (employees.length && days.length) {
          employeeIdElement.value = employees.join(",");
          dayElement.value = days.join(",");
        } else {
          return;
        }

        if (!modifyScheduleElement.open) {
          modifyScheduleElement.showModal();
        }
      };

      document.addEventListener("pointerup", handlePointerUp);
    };

    scheduleTable.addEventListener("pointerdown", handlePointerDown);

    if (!scheduleEventSource) {
      scheduleEventSource = new EventSource("/api/events/schedule");

      scheduleEventSource.onmessage = async () => {
        await generateFullSchedule();
      };
    }
  });

  onDestroy(() => {
    if (scheduleEventSource) {
      scheduleEventSource.close();
      scheduleEventSource = null;
    }
  });

  const addSchedule = async () => {
    const dialog = document.querySelector("dialog#modify_schedule") as HTMLDialogElement;
    const form = dialog?.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);

    const response = await fetch("/api/schedule", { method: "POST", body: formData });

    if ([200, 204].includes(response.status)) {
      dialog.close();
    }
  };
</script>

{#if !employees.length || !groups?.length}
  <div class="text-center">{m.no_employees()}</div>
{:else}
  <table class="table-auto border-collapse text-sm">
    <tbody>
      <TableHeaders {holidays} {year} {month} />
      {#each groups as group (group.id)}
        <tr>
          <td class="font-bold uppercase text-center">{group.name}</td>
        </tr>
        {#each employees as employee (employee.id)}
          {#if group.id === employee.groupId}
            <tr>
              <td class="px-4 whitespace-nowrap h-fit border-1">
                {employee.firstName}
                {employee.lastName}
              </td>
              {#each days as d}
                {#if employee.id in fullSchedule && d.idx in fullSchedule[employee.id]}
                  <td
                    use:addSelectable
                    style="background-color: {fullSchedule[employee.id][d.idx].color}"
                    class={[
                      "hover:bg-opacity-50 transition-colors border-1",
                      {
                        "bg-gray-300 text-gray-800": !fullSchedule[employee.id][d.idx]?.color && d.isToday,
                        "bg-custom-holiday": !fullSchedule[employee.id][d.idx]?.color && d.isFree,
                      },
                    ]}
                    data-employee={employee.id}
                    data-day={d.idx}
                    title={fullSchedule[employee.id][d.idx]?.label
                      ? `Shift ${fullSchedule[employee.id][d.idx].label}\n${fullSchedule[employee.id][d.idx].start} - ${fullSchedule[employee.id][d.idx].end}\n${fullSchedule[employee.id][d.idx].shiftType}`
                      : "Click to add shift"}
                  >
                    <button use:addSelectable class="flex flex-col items-center justify-center size-8" data-employee={employee.id} data-day={d.idx}>
                      {#if fullSchedule[employee.id][d.idx]?.label}
                        {fullSchedule[employee.id][d.idx].label}
                      {:else if fullSchedule[employee.id][d.idx]?.start && fullSchedule[employee.id][d.idx]?.end}
                        {fullSchedule[employee.id][d.idx].start}
                        <br />
                        {fullSchedule[employee.id][d.idx].end}
                      {/if}
                    </button>
                  </td>
                {:else}
                  <td
                    use:addSelectable
                    class={[
                      "hover:bg-opacity-50 transition-colors border-1",
                      { "bg-gray-300 text-gray-800": d.isToday, "bg-custom-holiday": d.isFree },
                    ]}
                    data-employee={employee.id}
                    data-day={d.idx}
                  >
                    <button
                      use:addSelectable
                      class="flex flex-col items-center justify-center size-8"
                      data-employee={employee.id}
                      data-day={d.idx}
                      aria-label="Add schedule"
                    >
                    </button>
                  </td>
                {/if}
              {/each}
              <td class={["border-1 text-xs text-center", { "font-bold": totalHours[employee.id] > 0 }]}>
                {totalHours[employee.id] ?? 0}
              </td>
            </tr>
          {/if}
        {/each}
      {/each}
      {#if shifts && shiftCounts}
        <TableHeaders {holidays} {year} {month} footer={true} />
        {#each shifts as s (s.id)}
          {#if shiftCounts[s.id]}
            <tr>
              <td class="px-4 h-fit min-w-64 border-1">
                {#if s.label}
                  {s.label}
                {:else}
                  <span>{s.shiftType}</span>
                  <span>
                    {fmtShift(s.start)} - {fmtShift(s.end)}
                  </span>
                {/if}
              </td>
              {#each days as d}
                <td class={["h-fit text-center border-1", { "bg-custom-holiday text-gray-100": d.isFree, "bg-gray-300 text-gray-800": d.isToday }]}>
                  {#if shiftCounts[s.id] && shiftCounts[s.id][d.idx]}
                    <span class="font-bold">
                      {shiftCounts[s.id][d.idx]}
                    </span>
                  {:else}
                    0
                  {/if}
                </td>
              {/each}
            </tr>
          {/if}
        {/each}
      {/if}
    </tbody>
  </table>

  {#if shifts}
    <dialog id="modify_schedule" class="rounded-xl">
      <div class="p-4">
        <div class="flex flex-col gap-8">
          <form class="flex flex-col gap-4">
            <select name="shift_id" class="bg-slate-200 px-4 py-2" required>
              <option value="-1">{m.none()}</option>
              {#each shifts as shift}
                <option value={shift.id}>
                  {#if shift.label}
                    {shift.label}
                  {:else}
                    {fmtShift(shift.start)} - {fmtShift(shift.end)}
                  {/if}
                </option>
              {/each}
            </select>
            <input name="employee_id" hidden />
            <input name="year" value={year} hidden />
            <input name="month" value={month} hidden />
            <input name="day" hidden />

            <div class="flex flex-row justify-between gap-4">
              <HTMLSubmit
                label={m.cancel()}
                type="button"
                onclick={() => {
                  const dialog = document.querySelector("dialog#modify_schedule") as HTMLDialogElement;

                  dialog.close();
                }}
              />
              <HTMLSubmit label={m.save()} class="col-span-2" type="button" onclick={addSchedule} />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  {/if}
{/if}

<style>
  :global(.intersected) {
    background-color: theme("colors.gray.600") !important;
  }
</style>
