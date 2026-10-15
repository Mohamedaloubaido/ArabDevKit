import { describe, expect, it } from "vitest";
import {
  formatMoney,
  getCountry,
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
  it("returns a unified country profile", () => {
    expect(getCountry("SA").currency).toBe("SAR");
    expect(getCountry("SY").callingCode).toBe("+963");
  });
});

describe("money", () => {
  it("formats using the country currency", () => {
    const result = formatMoney(125, "AE", { locale: "en-AE", currencyDisplay: "code" });
    expect(result).toContain("AED");
    expect(result).toContain("125");
  });
});
