import type { CountryProfile } from "./types.js";

export const syria = {
  code: "SY",
  iso3: "SYR",
  name: "Syria",
  nameAr: "سوريا",
  callingCode: "+963",
  currency: "SYP",
  locales: ["ar-SY", "en-SY"]
} as const satisfies CountryProfile;
