/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as "ar" | "en")) {
    locale = routing.defaultLocale;
  }

  try {
    const messages = await import(`../../messages/${locale}.json`);
    return {
      locale,
      messages: messages.default,
    };
  } catch (error) {
    // Handle the error, for example:
    console.error(`Error loading messages for locale ${locale}:`, error);
    return {
      locale,
      messages: {}, // or some default messages
    };
  }
});
