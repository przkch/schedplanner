import { db } from "@lib/database";
import { holiday } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    await db.delete(holiday).where(eq(holiday.id, Number(params.holidayId)));
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 400 });
  }
};
