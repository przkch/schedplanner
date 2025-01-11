import { db } from "@lib/database";
import { holiday } from "@lib/database/schema";

import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const holidays = await db.select().from(holiday).orderBy(holiday.date);

  return new Response(JSON.stringify(holidays), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  try {
    const newHoliday = await db
      .insert(holiday)
      .values({
        name: formData.get("name")?.toString(),
        date: formData.get("date")!.toString(),
      })
      .returning();

    return new Response(JSON.stringify(newHoliday), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(null, { status: 400 });
  }
};
