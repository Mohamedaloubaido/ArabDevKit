import { describe, expect, it } from "vitest";
import {
  createIban,
  findCountryByCallingCode,
  formatMoney,
  getCountry,
  isArabCountryCode,
  isValidIban,
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

describe("IBAN", () => {
  const officialExamples = [
    "AE070331234567890123456",
    "BH67BMAG00001299123456",
    "DJ2100010000000154000100186",
    "EG380019000500000000263180002",
    "IQ98NBIQ850123456789012",
    "JO94CBJO0010000000000131000302",
    "KW81CBKU0000000000001234560101",
    "LB62099900000001001901229114",
    "LY83002048000020100120361",
    "MR1300020001010000123456753",
    "OM810180000001299123456",
    "PS92PALS000000000400123456702",
    "QA58DOHB00001234567890ABCDEFG",
    "SA0380000000608010167519",
    "SD2129010501234001",
    "SO211000001001000100141",
    "TN5910006035183598478831",
    "YE15CBYE0001018861234567891234"
  ] as const;

  it("validates official SWIFT examples for Arab IBAN markets", async () => {
    const { isValidIban, listArabIbanSpecs } = await import("../src/index.js");
    expect(listArabIbanSpecs()).toHaveLength(18);
    for (const iban of officialExamples) expect(isValidIban(iban)).toBe(true);
  });

  it("accepts print format and Arabic-Indic check digits", async () => {
    const { isValidIban } = await import("../src/index.js");
    expect(isValidIban("SA٠٣ 8000 0000 6080 1016 7519", "SA")).toBe(true);
  });

  it("rejects a valid-looking IBAN with a broken checksum", async () => {
    const { validateIban } = await import("../src/index.js");
    expect(validateIban("SA0480000000608010167519").reason).toBe("invalid-checksum");
  });

  it("parses bank and branch identifiers from country structure", async () => {
    const { parseIban } = await import("../src/index.js");
    const jordan = parseIban("JO94CBJO0010000000000131000302");
    expect(jordan?.bankIdentifier).toBe("CBJO");
    expect(jordan?.branchIdentifier).toBe("0010");
  });

  it("builds checksum-valid IBANs from valid BBANs", () => {
    const iban = createIban("SA", "80000000608010167519");
    expect(iban).toBe("SA0380000000608010167519");
    expect(isValidIban(iban ?? "", "SA")).toBe(true);
  });
});
