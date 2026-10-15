import type { CountryProfile } from "./types.js";

export const egypt = {
  code: "EG",
  iso3: "EGY",
  name: "Egypt",
  nameAr: "مصر",
  callingCode: "+20",
  defaultCurrency: "EGP",
  currencies: ["EGP"],
  locales: ["ar-EG", "en-EG"]
} as const satisfies CountryProfile;
