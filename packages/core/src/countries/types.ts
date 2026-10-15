export type ArabCountryCode = "SA" | "AE" | "EG" | "SY";

export interface CountryProfile {
  code: ArabCountryCode;
  iso3: string;
  name: string;
  nameAr: string;
  callingCode: `+${string}`;
  currency: string;
  locales: readonly string[];
}
