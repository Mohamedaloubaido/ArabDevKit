import type { CountryProfile } from "./types.js";

export const saudiArabia = {
  code: "SA",
  iso3: "SAU",
  name: "Saudi Arabia",
  nameAr: "السعودية",
  callingCode: "+966",
  currency: "SAR",
  locales: ["ar-SA", "en-SA"]
} as const satisfies CountryProfile;
