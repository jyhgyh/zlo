// src/middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "ru"],
  defaultLocale: "en",
});

export const config = {
  matcher: [
    "/((?!api|admin|graphql|graphql-playground|trpc|_next|_vercel|.*\\..*).*)",
  ],
};