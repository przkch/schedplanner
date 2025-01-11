import { db } from "@lib/database";
import { holiday } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const formData = await request.formData();

  try {
    const data = await db
      .update(holiday)
      .set({ name: formData.get("name")?.toString(), date: formData.get("date")?.toString() })
      .where(eq(holiday.id, Number(params.holidayId)))
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
