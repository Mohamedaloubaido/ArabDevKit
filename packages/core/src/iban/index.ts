import { toLatinDigits } from "../number/digits.js";
import {
  ARAB_IBAN_SPECS,
  getArabIbanSpec,
  isArabIbanCountryCode,
  listArabIbanSpecs,
  type ArabIbanCountryCode,
  type ArabIbanSpec
} from "./specs.js";

export {
  ARAB_IBAN_SPECS,
  getArabIbanSpec,
  isArabIbanCountryCode,
  listArabIbanSpecs,
  type ArabIbanCountryCode,
  type ArabIbanSpec
} from "./specs.js";

export type IbanValidationReason =
  | "invalid-format"
  | "unsupported-country"
  | "country-mismatch"
  | "invalid-length"
  | "invalid-bban"
  | "invalid-checksum";

export interface IbanValidationResult {
  valid: boolean;
  iban: string;
  countryCode: string | null;
  reason?: IbanValidationReason;
}

export interface ParsedArabIban {
  iban: string;
  formatted: string;
  countryCode: ArabIbanCountryCode;
  checkDigits: string;
  bban: string;
  bankIdentifier: string;
  branchIdentifier: string | null;
}

/** Convert print-form IBAN input into uppercase electronic format. */
export function normalizeIban(input: string): string {
  return toLatinDigits(input).replace(/\s+/g, "").toUpperCase();
}

/** Group an IBAN in blocks of four for display without changing its value. */
export function formatIban(input: string): string {
  return normalizeIban(input).replace(/(.{4})(?=.)/g, "$1 ");
}

function extractField(bban: string, field: { start: number; length: number }): string {
  const start = field.start - 1;
  return bban.slice(start, start + field.length);
}

function mod97(input: string): number {
  let remainder = 0;

  for (const char of input) {
    const numeric = char >= "A" && char <= "Z"
      ? String(char.charCodeAt(0) - 55)
      : char;

    for (const digit of numeric) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder;
}

/**
 * ISO 13616 MOD-97 checksum validation, implemented as a streaming remainder
 * so it never relies on an integer larger than JavaScript can represent exactly.
 */
export function hasValidIbanChecksum(input: string): boolean {
  const iban = normalizeIban(input);
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) return false;

  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  return mod97(rearranged) === 1;
}

/** Build a checksum-valid IBAN from a country code and a BBAN that matches the SWIFT-backed country format. */
export function createIban(countryCode: ArabIbanCountryCode, bbanInput: string): string | null {
  const spec = getArabIbanSpec(countryCode);
  const bban = toLatinDigits(bbanInput).replace(/\s+/g, "").toUpperCase();
  const bbanRegex = new RegExp(`^${spec.bbanPattern}$`);
  if (bban.length !== spec.bbanLength || !bbanRegex.test(bban)) return null;

  const checkInput = `${bban}${countryCode}00`;
  const checkDigits = String(98 - mod97(checkInput)).padStart(2, "0");
  return `${countryCode}${checkDigits}${bban}`;
}

export function validateIban(
  input: string,
  expectedCountry?: ArabIbanCountryCode
): IbanValidationResult {
  const iban = normalizeIban(input);

  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
    return { valid: false, iban, countryCode: null, reason: "invalid-format" };
  }

  const countryCode = iban.slice(0, 2);
  if (!isArabIbanCountryCode(countryCode)) {
    return { valid: false, iban, countryCode, reason: "unsupported-country" };
  }

  if (expectedCountry && countryCode !== expectedCountry) {
    return { valid: false, iban, countryCode, reason: "country-mismatch" };
  }

  const spec = ARAB_IBAN_SPECS[countryCode];
  if (iban.length !== spec.ibanLength) {
    return { valid: false, iban, countryCode, reason: "invalid-length" };
  }

  const bban = iban.slice(4);
  const bbanRegex = new RegExp(`^${spec.bbanPattern}$`);
  if (!bbanRegex.test(bban)) {
    return { valid: false, iban, countryCode, reason: "invalid-bban" };
  }

  if (!hasValidIbanChecksum(iban)) {
    return { valid: false, iban, countryCode, reason: "invalid-checksum" };
  }

  return { valid: true, iban, countryCode };
}

export function isValidIban(input: string, expectedCountry?: ArabIbanCountryCode): boolean {
  return validateIban(input, expectedCountry).valid;
}

export function parseIban(input: string): ParsedArabIban | null {
  const result = validateIban(input);
  if (!result.valid || !result.countryCode || !isArabIbanCountryCode(result.countryCode)) {
    return null;
  }

  const iban = result.iban;
  const spec = getArabIbanSpec(result.countryCode);
  const bban = iban.slice(4);

  return {
    iban,
    formatted: formatIban(iban),
    countryCode: result.countryCode,
    checkDigits: iban.slice(2, 4),
    bban,
    bankIdentifier: extractField(bban, spec.bankIdentifier),
    branchIdentifier: spec.branchIdentifier ? extractField(bban, spec.branchIdentifier) : null
  };
}
