import { db } from "@lib/database";
import { team } from "@lib/database/schema";

import { setLanguageTag } from "@paraglide/runtime";
import type { AvailableLanguageTag } from "@paraglide/runtime";
import { defineMiddleware } from "astro:middleware";
import { eq } from "drizzle-orm";

export const onRequest = defineMiddleware(async (context, next) => {
  const isApiRoute = context.url.pathname.startsWith("/api");

  if (isApiRoute) return next();

  setLanguageTag((context.preferredLocale || "en") as AvailableLanguageTag);

  const isTeamsSubpage = context.url.pathname.startsWith("/teams");

  if (!context.cookies.has("current_team_id") && !isTeamsSubpage) {
    console.log("Current team not set");

    const teams = await db.select().from(team).where(eq(team.defaultTeam, true));

    if (!teams.length) {
      console.log("No teams found in the database, redirecting to /teams");
      return context.redirect("/teams");
    }

    let newCurrentTeam = teams.find((t) => t.defaultTeam);

    if (!newCurrentTeam) {
      console.log("Default team not found in the database, setting it to the first team in the database");

      newCurrentTeam = teams[0];
    }

    console.log("Setting current team to the %o", newCurrentTeam);

    context.cookies.set("current_team_id", newCurrentTeam.id.toString());
  }

  return next();
});
