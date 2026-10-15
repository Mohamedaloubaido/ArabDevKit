import { describe, expect, it } from "vitest";
import { getTaxIdentifierInputState } from "../src/index.js";

describe("TaxIdentifierInput helpers", () => {
  it("shares Saudi VAT validation with core", () => {
    const state = getTaxIdentifierInputState("٣١٠١٢٢٣٩٣٥٠٠٠٠٣", "SA", "vat");
    expect(state.valid).toBe(true);
    expect(state.normalized).toBe("310122393500003");
  });

  it("rejects short UAE TRNs", () => {
    expect(getTaxIdentifierInputState("123", "AE", "trn").reason).toBe("invalid-length");
  });
});
