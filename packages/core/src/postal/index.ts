import type { ArabCountryCode } from "../countries/types.js";
import { toLatinDigits } from "../number/digits.js";

export type PostalSupportMode = "postal-code" | "po-box" | "unverified";

export interface PostalProfile {
  countryCode: ArabCountryCode;
  support: PostalSupportMode;
  postalCodeSupported: boolean | null;
  poBoxSupported: boolean | null;
  postalCodeLength: number | null;
  validationMode: "structural" | "authority-assigned" | "unverified";
  sourceUrl: string | null;
  notes: string;
}

export interface PostalCodeValidationResult {
  valid: boolean;
  normalized: string;
  countryCode: ArabCountryCode;
  reason: "invalid-characters" | "invalid-length" | "not-used" | "unverified-country" | null;
  structuralOnly: true;
}

const SAUDI_POSTAL_PROFILE: PostalProfile = {
  countryCode: "SA",
  support: "postal-code",
  postalCodeSupported: true,
  poBoxSupported: null,
  postalCodeLength: 5,
  validationMode: "structural",
  sourceUrl: "https://splonline.com.sa/en/business/",
  notes: "Saudi National Address uses a 5-digit postal code. Structural validation does not prove that a code maps to a specific address."
};

const UAE_POSTAL_PROFILE: PostalProfile = {
  countryCode: "AE",
  support: "po-box",
  postalCodeSupported: false,
  poBoxSupported: true,
  postalCodeLength: null,
  validationMode: "authority-assigned",
  sourceUrl: "https://www.emiratespost.ae/faq",
  notes: "Emirates Post's UAE address format uses a P.O. Box and physical address; ArabDevKit does not assert a national postal-code format."
};

export function getPostalProfile(countryCode: ArabCountryCode): PostalProfile {
  if (countryCode === "SA") return { ...SAUDI_POSTAL_PROFILE };
  if (countryCode === "AE") return { ...UAE_POSTAL_PROFILE };
  return {
    countryCode,
    support: "unverified",
    postalCodeSupported: null,
    poBoxSupported: null,
    postalCodeLength: null,
    validationMode: "unverified",
    sourceUrl: null,
    notes: "No country-specific postal rule is asserted until an authoritative source is configured."
  };
}

export function normalizePostalCode(value: string): string {
  return toLatinDigits(value).trim().replace(/\s+/g, "");
}

export function validatePostalCode(value: string, countryCode: ArabCountryCode): PostalCodeValidationResult {
  const profile = getPostalProfile(countryCode);
  const normalized = normalizePostalCode(value);

  if (profile.postalCodeSupported === false) {
    return { valid: false, normalized, countryCode, reason: "not-used", structuralOnly: true };
  }
  if (profile.postalCodeSupported !== true || profile.postalCodeLength === null) {
    return { valid: false, normalized, countryCode, reason: "unverified-country", structuralOnly: true };
  }
  if (!/^\d+$/.test(normalized)) {
    return { valid: false, normalized, countryCode, reason: "invalid-characters", structuralOnly: true };
  }
  if (normalized.length !== profile.postalCodeLength) {
    return { valid: false, normalized, countryCode, reason: "invalid-length", structuralOnly: true };
  }
  return { valid: true, normalized, countryCode, reason: null, structuralOnly: true };
}

export function normalizePoBox(value: string): string {
  return toLatinDigits(value).trim().replace(/\s+/g, "");
}
