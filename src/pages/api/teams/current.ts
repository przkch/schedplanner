import { db } from "@lib/database";
import { team } from "@lib/database/schema";

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ cookies }) => {
  if (!cookies.has("current_team_id")) {
    return new Response(null);
  }
  const currentTeamId = cookies.get("current_team_id")!.number();

  const currentTeam = await db.select().from(team).where(eq(team.id, currentTeamId));

  if (!currentTeam.length) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Current team not found in the database",
      }),
      {
        status: 400,
        statusText: "Current team not found in the database",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(JSON.stringify(currentTeam[0]), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  const form_data = await request.formData();

  cookies.set("current_team_id", form_data.get("chosen_team") as string, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return redirect(request.headers.get("referer") || "/");
};
