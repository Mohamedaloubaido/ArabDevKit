import { z } from "zod";
import {
  isValidIban,
  isValidPhone,
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

export const sa = { phone: () => phone("SA"), iban: () => iban("SA") } as const;
export const ae = { phone: () => phone("AE"), iban: () => iban("AE") } as const;
export const eg = { phone: () => phone("EG"), iban: () => iban("EG") } as const;
export const sy = { phone: () => phone("SY") } as const;
