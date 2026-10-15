import { saudiArabia } from "./sa.js";
import { unitedArabEmirates } from "./ae.js";
import { egypt } from "./eg.js";
import { syria } from "./sy.js";
import type { ArabCountryCode, CountryProfile } from "./types.js";

export type { ArabCountryCode, CountryProfile } from "./types.js";
export { saudiArabia, unitedArabEmirates, egypt, syria };

export const countries = {
  SA: saudiArabia,
  AE: unitedArabEmirates,
  EG: egypt,
  SY: syria
} as const satisfies Record<ArabCountryCode, CountryProfile>;

export function getCountry(code: ArabCountryCode): CountryProfile {
  return countries[code];
}
