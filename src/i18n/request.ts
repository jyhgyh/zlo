import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "@/i18n/routing";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale =
    locale && (locales as readonly string[]).includes(locale)
      ? locale
      : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
