import { setLanguageTag } from "@paraglide/runtime";
import type { AvailableLanguageTag } from "@paraglide/runtime";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  setLanguageTag((context.preferredLocale || "en") as AvailableLanguageTag);

  return next();
});
