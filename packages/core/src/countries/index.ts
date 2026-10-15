import { saudiArabia } from "./sa.js";
import { unitedArabEmirates } from "./ae.js";
import { egypt } from "./eg.js";
import { syria } from "./sy.js";
import { additionalCountries } from "./additional.js";
import type { ArabCountryCode, CountryProfile } from "./types.js";

export type { ArabCountryCode, CountryProfile } from "./types.js";
export { saudiArabia, unitedArabEmirates, egypt, syria, additionalCountries };

export const countries = {
  ...additionalCountries,
  EG: egypt,
  SA: saudiArabia,
  SY: syria,
  AE: unitedArabEmirates
} as const satisfies Record<ArabCountryCode, CountryProfile>;

export function getCountry(code: ArabCountryCode): CountryProfile {
  return countries[code];
}

export function isArabCountryCode(value: string): value is ArabCountryCode {
  return Object.prototype.hasOwnProperty.call(countries, value.toUpperCase());
}

export function listCountries(): CountryProfile[] {
  return Object.values(countries);
}

export function findCountryByCallingCode(callingCode: string): CountryProfile | null {
  const normalized = callingCode.startsWith("+") ? callingCode : `+${callingCode}`;
  return listCountries().find((country) => country.callingCode === normalized) ?? null;
}
