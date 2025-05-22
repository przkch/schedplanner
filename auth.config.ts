import { db } from "@lib/database";
import { accounts, users, sessions, verificationTokens } from "@lib/database/schema/auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Provider } from "@auth/core/providers";
import {
  AUTH_SECRET,
  AUTH_TRUST_HOST,
  AUTH_ALLOW_DANGEROUS_EMAIL_ACCOUNT_LINKING,
  AUTH_GITHUB_CLIENT_ID,
  AUTH_GITHUB_CLIENT_SECRET,
} from "astro:env/server";
import { defineConfig } from "auth-astro";
import GitHub from "@auth/core/providers/github";

const providers: Provider[] = [];

if ([AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET].every((v) => v)) {
  providers.push(
    GitHub({
      clientId: AUTH_GITHUB_CLIENT_ID,
      clientSecret: AUTH_GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: AUTH_ALLOW_DANGEROUS_EMAIL_ACCOUNT_LINKING,
    })
  );
}

export default defineConfig({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: providers,
  secret: AUTH_SECRET,
  trustHost: AUTH_TRUST_HOST,
});
