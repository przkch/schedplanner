import { db } from "@lib/database";
import { group } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const formData = await request.formData();

  try {
    const data = await db
      .update(group)
      .set({ name: formData.get("group_name")?.toString() })
      .where(eq(group.id, Number(params.groupId)))
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
