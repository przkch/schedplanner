import { db } from "@lib/database";
import { employee } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";

export const POST: APIRoute = async ({ params, request }) => {
  const formData = await request.formData();

  try {
    const data = await db
      .update(employee)
      .set({
        firstName: formData.get("first_name")?.toString(),
        lastName: formData.get("last_name")?.toString(),
      })
      .where(and(eq(employee.teamId, Number(params.teamId)), eq(employee.id, Number(params.employeeId))));

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 400 });
  }
};
