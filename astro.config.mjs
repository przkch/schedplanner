import { defineConfig, envField } from "astro/config";

import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import paraglide from "@inlang/paraglide-astro";
import basicSsl from "@vitejs/plugin-basic-ssl";

import icon from "astro-icon";

import svelte from "@astrojs/svelte";

import auth from "auth-astro";

export default defineConfig({
  output: "server",
  integrations: [tailwind(), paraglide({ project: "./schedplanner.inlang", outdir: "./src/paraglide" }), icon(), svelte(), auth()],

  adapter: node({
    mode: "standalone",
  }),

  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl"],
  },

  vite: {
    plugins: [basicSsl()],
    server: {
      https: process.env.DEV,
    },
  },

  env: {
    schema: {
      PSQL_CONN: envField.string({
        context: "server",
        access: "secret",
      }),

      AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      AUTH_TRUST_HOST: envField.boolean({
        context: "server",
        access: "secret",
      }),
      AUTH_ALLOW_DANGEROUS_EMAIL_ACCOUNT_LINKING: envField.boolean({
        context: "server",
        access: "secret",
        optional: true,
        default: false,
      }),

      AUTH_AUTHENTIK_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      AUTH_AUTHENTIK_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      AUTH_AUTHENTIK_ISSUER: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      AUTH_GITHUB_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      AUTH_GITHUB_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
