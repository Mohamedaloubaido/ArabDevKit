import { describe, expect, it } from "vitest";
import {
  getTaxIdentifierSpec,
  isValidSaudiTin,
  isValidUaeTrn,
  validateTaxIdentifier
} from "../src/index.js";

describe("tax identifiers", () => {
  it("normalizes Arabic-Indic digits for Saudi VAT numbers", () => {
    const result = validateTaxIdentifier("٣١٠١٢٢٣٩٣٥٠٠٠٠٣", "SA", "vat");
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe("310122393500003");
    expect(result.structuralOnly).toBe(true);
  });

  it("validates the documented Saudi TIN length", () => {
    expect(isValidSaudiTin("1234567890")).toBe(true);
    expect(isValidSaudiTin("123456789")).toBe(false);
  });

  it("validates the documented UAE TRN length", () => {
    expect(isValidUaeTrn("100123456700003")).toBe(true);
    expect(validateTaxIdentifier("100123", "AE", "trn").reason).toBe("invalid-length");
  });

  it("does not claim authority verification", () => {
    expect(getTaxIdentifierSpec("AE", "trn")?.structuralOnly).toBe(true);
  });
});
