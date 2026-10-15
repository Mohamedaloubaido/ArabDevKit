import { z } from "zod";
import { isValidPhone, type ArabCountryCode } from "@arabdevkit/core";

export function phone(country: ArabCountryCode) {
  return z.string().refine((value) => isValidPhone(value, country), {
    message: `Invalid ${country} phone number`
  });
}

export const sa = { phone: () => phone("SA") } as const;
export const ae = { phone: () => phone("AE") } as const;
export const eg = { phone: () => phone("EG") } as const;
export const sy = { phone: () => phone("SY") } as const;
