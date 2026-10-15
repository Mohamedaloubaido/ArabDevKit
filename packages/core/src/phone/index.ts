import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { toLatinDigits } from "../number/digits.js";
import type { ArabCountryCode } from "../countries/types.js";

function sanitizePhone(input: string): string {
  return toLatinDigits(input).trim().replace(/[\s()-]/g, "");
}

export function parsePhone(input: string, country: ArabCountryCode) {
  return parsePhoneNumberFromString(sanitizePhone(input), country as CountryCode);
}

export function isValidPhone(input: string, country: ArabCountryCode): boolean {
  const phone = parsePhone(input, country);
  return Boolean(phone?.isValid() && phone.country === country);
}

export function formatPhoneE164(input: string, country: ArabCountryCode): string | null {
  const phone = parsePhone(input, country);
  if (!phone?.isValid() || phone.country !== country) return null;
  return phone.number;
}

export function formatPhoneNational(input: string, country: ArabCountryCode): string | null {
  const phone = parsePhone(input, country);
  if (!phone?.isValid() || phone.country !== country) return null;
  return phone.formatNational();
}
