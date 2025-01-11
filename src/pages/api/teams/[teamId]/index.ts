import { db } from "@lib/database";
import { team } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
  try {
    const data = (
      await db
        .select()
        .from(team)
        .where(eq(team.id, Number(params.teamId)))
    )[0];

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(null, { status: 400 });
  }
};
