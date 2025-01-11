import { db } from "@lib/database";
import { employee, schedule, shift } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { and, eq, inArray } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
  const teamId = Number(params.teamId);
  const year = Number(params.year);
  const month = Number(params.month);

  try {
    const employees = await db.select().from(employee).where(eq(employee.teamId, teamId)).orderBy(employee.firstName, employee.lastName);

    if (!employees.length) {
      return new Response("No employees found in the database", {
        status: 400,
        statusText: "NO_EMPLOYEES",
      });
    }

    const employees_ids = employees.flatMap((e) => e.id);

    const employees_schedule = await db
      .select({
        employeeId: schedule.employeeId,
        shiftId: shift.id,
        year: schedule.year,
        month: schedule.month,
        day: schedule.day,
        label: shift.label,
        start: shift.start,
        end: shift.end,
        color: shift.color,
        shiftType: shift.shiftType,
      })
      .from(schedule)
      .where(and(eq(schedule.year, year), eq(schedule.month, month), inArray(schedule.employeeId, employees_ids)))
      .leftJoin(shift, eq(schedule.shiftId, shift.id))
      .leftJoin(employee, eq(schedule.employeeId, employee.id))
      .orderBy(schedule.day);

    return new Response(JSON.stringify(employees_schedule), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(null, { status: 500 });
  }
};
