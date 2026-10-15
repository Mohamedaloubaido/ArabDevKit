import { z } from "zod";
import {
  isValidIban,
  isValidPhone,
  validateAddress,
  validateTaxIdentifier,
  validatePostalCode,
  type AddressValue,
  type ArabCountryCode,
  type ArabIbanCountryCode
} from "@arabdevkit/core";

export function phone(country: ArabCountryCode) {
  return z.string().refine((value) => isValidPhone(value, country), {
    message: `Invalid ${country} phone number`
  });
}

export function iban(country: ArabIbanCountryCode) {
  return z.string().refine((value) => isValidIban(value, country), {
    message: `Invalid ${country} IBAN`
  });
}

export function address(country: ArabCountryCode) {
  return z.custom<AddressValue>((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    return validateAddress(country, value as AddressValue).valid;
  }, {
    message: `Invalid ${country} address`
  });
}

export function postalCode(country: ArabCountryCode) {
  return z.string().refine((value) => validatePostalCode(value, country).valid, {
    message: `Invalid ${country} postal code structure`
  });
}

export function taxIdentifier(country: "SA" | "AE", kind: "vat" | "tin" | "trn") {
  return z.string().refine((value) => validateTaxIdentifier(value, country, kind).valid, {
    message: `Invalid ${country} ${kind.toUpperCase()} structure`
  });
}

export const sa = { phone: () => phone("SA"), iban: () => iban("SA"), address: () => address("SA"), vatNumber: () => taxIdentifier("SA", "vat"), tin: () => taxIdentifier("SA", "tin"), postalCode: () => postalCode("SA") } as const;
export const ae = { phone: () => phone("AE"), iban: () => iban("AE"), address: () => address("AE"), trn: () => taxIdentifier("AE", "trn") } as const;
export const eg = { phone: () => phone("EG"), iban: () => iban("EG"), address: () => address("EG") } as const;
export const sy = { phone: () => phone("SY"), address: () => address("SY") } as const;
