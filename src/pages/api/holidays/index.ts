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

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  await db.insert(holiday).values({
    name: formData.get("name")?.toString(),
    date: formData.get("date")!.toString(),
  });

  return redirect(request.headers.get("referer") || "/");
};
