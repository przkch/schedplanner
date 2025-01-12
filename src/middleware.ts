import { db } from "@lib/database";
import { team } from "@lib/database/schema";

import { setLanguageTag } from "@paraglide/runtime";
import type { AvailableLanguageTag } from "@paraglide/runtime";
import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";
import { eq } from "drizzle-orm";

export const onRequest = defineMiddleware(async (context, next) => {
  const isApiAuthRoute = context.url.pathname.startsWith("/api/auth/");
  const isApiRoute = context.url.pathname.startsWith("/api") && !isApiAuthRoute;
  const session = await getSession(context.request);

  if (!session && !isApiAuthRoute) {
    if (isApiRoute) {
      return new Response("Unauthorized", { status: 401, statusText: "Unauthorized" });
    }

    return context.redirect("/api/auth/signin");
  }

  if (!context.locals.session) {
    context.locals.session = session;
  }

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
