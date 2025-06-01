import { AUTH_ALLOW_DANGEROUS_EMAIL_ACCOUNT_LINKING } from "astro:env/server";

import type { Provider } from "@auth/core/providers";

export const providers: Provider[] = [];

if (import.meta.env.AUTH_GITHUB_ID && import.meta.env.AUTH_GITHUB_SECRET) {
  const { default: Github } = await import("@auth/core/providers/github");

  providers.push(
    Github({
      clientId: import.meta.env.AUTH_GITHUB_ID,
      clientSecret: import.meta.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: AUTH_ALLOW_DANGEROUS_EMAIL_ACCOUNT_LINKING,
    })
  );
}

if (import.meta.env.AUTH_KEYCLOAK_ID && import.meta.env.AUTH_KEYCLOAK_SECRET && import.meta.env.AUTH_KEYCLOAK_ISSUER) {
  const { default: Keycloak } = await import("@auth/core/providers/keycloak");

  providers.push(
    Keycloak({
      clientId: import.meta.env.AUTH_KEYCLOAK_ID,
      clientSecret: import.meta.env.AUTH_KEYCLOAK_SECRET,
      issuer: import.meta.env.AUTH_KEYCLOAK_ISSUER,
      allowDangerousEmailAccountLinking: AUTH_ALLOW_DANGEROUS_EMAIL_ACCOUNT_LINKING,
    })
  );
}
