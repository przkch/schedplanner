import { db } from "@lib/database";
import { authAccountT, authUserT, authSessionT, authVerificationTokenT } from "@lib/database/schema/auth";
import { providers } from "@lib/auth/providers";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AUTH_SECRET, AUTH_TRUST_HOST } from "astro:env/server";
import { defineConfig } from "auth-astro";

export default defineConfig({
  adapter: DrizzleAdapter(db, {
    usersTable: authUserT,
    accountsTable: authAccountT,
    sessionsTable: authSessionT,
    verificationTokensTable: authVerificationTokenT,
  }),
  providers: providers,
  secret: AUTH_SECRET,
  trustHost: AUTH_TRUST_HOST,
});
