import { describe, expect, it } from "vitest";
import { isValidIban, isValidPhone, listCountries } from "@arabdevkit/core";
import { createArabFaker } from "../src/index.js";

 describe("ArabDevKit faker", () => {
  it("is deterministic when seeded", () => {
    const a = createArabFaker("SA", { seed: 2026 });
    const b = createArabFaker("SA", { seed: 2026 });
    expect(a.person()).toEqual(b.person());
    expect(a.address()).toEqual(b.address());
  });

  it("creates basic entities for all registered Arab markets", () => {
    for (const country of listCountries()) {
      const fake = createArabFaker(country.code, { seed: 42 });
      expect(fake.person().countryCode).toBe(country.code);
      expect(fake.address().city.length).toBeGreaterThan(0);
      expect(fake.company().name.length).toBeGreaterThan(0);
    }
  });

  it("creates a valid synthetic Saudi phone number", () => {
    const phone = createArabFaker("SA", { seed: 7 }).phone();
    expect(phone).not.toBeNull();
    expect(phone?.synthetic).toBe(true);
    expect(phone ? isValidPhone(phone.e164, "SA") : false).toBe(true);
  });

  it("creates checksum-valid synthetic IBANs for configured markets", () => {
    const generated = createArabFaker("AE", { seed: 11 }).iban();
    expect(generated).not.toBeNull();
    expect(generated?.synthetic).toBe(true);
    expect(generated ? isValidIban(generated.iban, "AE") : false).toBe(true);
  });

  it("returns null for markets without a configured IBAN format", () => {
    expect(createArabFaker("SY", { seed: 11 }).iban()).toBeNull();
  });
});
