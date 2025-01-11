import { db } from "@lib/database";
import { employee, group } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
  const employees = await db
    .select({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      teamId: employee.teamId,
      groupId: employee.groupId,
      groupName: group.name,
    })
    .from(employee)
    .where(eq(employee.teamId, Number(params.teamId)))
    .leftJoin(group, eq(employee.groupId, group.id))
    .orderBy(employee.firstName, employee.lastName);

  return new Response(JSON.stringify(employees), { headers: { "Content-Type": "application/json" } });
};

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const form_data = await request.formData();

  try {
    const data = await db
      .insert(employee)
      .values({
        firstName: form_data.get("first_name")!.toString(),
        lastName: form_data.get("last_name")!.toString(),
        teamId: Number(params.teamId),
        groupId: Number(form_data.get("group_id")),
      })
      .returning();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(null, { status: 400 });
  }
};
