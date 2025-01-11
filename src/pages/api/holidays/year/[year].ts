import { db } from "@lib/database";
import { holiday } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { sql } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
  const year = params.year;

  if (!params.year) {
    return new Response("MISSING_YEAR", { status: 400, statusText: "MISSING_YEAR" });
  }

  const holidays = await db
    .select()
    .from(holiday)
    .where(sql.raw(`date::text LIKE '${year!.toString()}-%'`));

  return new Response(JSON.stringify(holidays), { headers: { "Content-Type": "application/json" } });
};
