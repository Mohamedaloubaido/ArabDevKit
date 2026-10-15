import { describe, expect, it } from "vitest";
import {
  findCountryByCallingCode,
  formatMoney,
  getCountry,
  isArabCountryCode,
  listCountries,
  normalizeArabic,
  toArabicIndicDigits,
  toLatinDigits
} from "../src/index.js";

describe("Arabic text", () => {
  it("normalizes common Arabic orthographic variants", () => {
    expect(normalizeArabic("إِلَى السُّعُودِيَّةِ ـ الآن")).toBe("الي السعودية  الان");
  });
});

describe("Arabic digits", () => {
  it("converts Arabic-Indic digits to Latin", () => {
    expect(toLatinDigits("طلب رقم ١٢٣٤٥")).toBe("طلب رقم 12345");
  });

  it("converts Latin digits to Arabic-Indic", () => {
    expect(toArabicIndicDigits("Order 2026")).toBe("Order ٢٠٢٦");
  });
});

describe("country registry", () => {
  it("contains all 22 Arab country profiles", () => {
    expect(listCountries()).toHaveLength(22);
  });

  it("returns unified country metadata", () => {
    expect(getCountry("SA").defaultCurrency).toBe("SAR");
    expect(getCountry("SY").callingCode).toBe("+963");
    expect(getCountry("PS").defaultCurrency).toBeNull();
    expect(getCountry("PS").currencies).toContain("ILS");
  });

  it("validates country codes and calling codes", () => {
    expect(isArabCountryCode("MA")).toBe(true);
    expect(isArabCountryCode("ma")).toBe(true);
    expect(isArabCountryCode("US")).toBe(false);
    expect(findCountryByCallingCode("974")?.code).toBe("QA");
  });
});

describe("money", () => {
  it("formats using the country default currency", () => {
    const result = formatMoney(125, "AE", { locale: "en-AE", currencyDisplay: "code" });
    expect(result).toContain("AED");
    expect(result).toContain("125");
  });

  it("requires an explicit currency when a market has no single default", () => {
    expect(() => formatMoney(10, "PS")).toThrow(/no single default currency/i);
    const result = formatMoney(10, "PS", { locale: "en", currency: "ILS", currencyDisplay: "code" });
    expect(result).toContain("ILS");
  });
});
