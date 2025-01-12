import { db } from "@lib/database";
import { accounts, users, sessions, verificationTokens } from "@lib/database/schema/auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Authentik from "@auth/core/providers/authentik";
import { AUTH_SECRET, AUTH_TRUST_HOST, AUTH_AUTHENTIK_CLIENT_ID, AUTH_AUTHENTIK_CLIENT_SECRET, AUTH_AUTHENTIK_ISSUER } from "astro:env/server";
import { defineConfig } from "auth-astro";

export default defineConfig({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Authentik({
      clientId: AUTH_AUTHENTIK_CLIENT_ID,
      clientSecret: AUTH_AUTHENTIK_CLIENT_SECRET,
      issuer: AUTH_AUTHENTIK_ISSUER,
    }),
  ],
  secret: AUTH_SECRET,
  trustHost: AUTH_TRUST_HOST,
});
