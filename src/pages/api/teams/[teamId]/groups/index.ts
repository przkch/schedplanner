import { db } from "@lib/database";
import { group } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ params }) => {
  try {
    const groups = await db
      .select()
      .from(group)
      .where(eq(group.teamId, Number(params.teamId)))
      .orderBy(group.name);

    return new Response(JSON.stringify(groups), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(null, { status: 400 });
  }
};

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const formData = await request.formData();

  try {
    const newGroup = await db
      .insert(group)
      .values({
        name: formData.get("name")!.toString(),
        teamId: Number(params.teamId),
      })
      .returning();

    return new Response(JSON.stringify(newGroup), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(null, { status: 400 });
  }
};
