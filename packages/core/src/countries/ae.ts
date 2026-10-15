import type { CountryProfile } from "./types.js";

export const unitedArabEmirates = {
  code: "AE",
  iso3: "ARE",
  name: "United Arab Emirates",
  nameAr: "الإمارات العربية المتحدة",
  callingCode: "+971",
  defaultCurrency: "AED",
  currencies: ["AED"],
  locales: ["ar-AE", "en-AE"]
} as const satisfies CountryProfile;
