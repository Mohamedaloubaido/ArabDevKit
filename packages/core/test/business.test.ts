import { describe, expect, it } from "vitest";
import {
  getBusinessRegistrySpec,
  prepareBusinessIdentifierLookup
} from "../src/index.js";

describe("business registry verification", () => {
  it("keeps Saudi commercial registration verification authority-backed", () => {
    const spec = getBusinessRegistrySpec("SA");
    expect(spec?.validationMode).toBe("verification-only");
    expect(spec?.searchBy).toContain("unified national number");
  });

  it("does not invent structural validity for UAE licence numbers", () => {
    const lookup = prepareBusinessIdentifierLookup(" 123 456 ", "AE");
    expect(lookup.normalized).toBe("123 456");
    expect(lookup.structurallyValid).toBeNull();
    expect(lookup.authoritativeVerificationRequired).toBe(true);
  });

  it("normalizes Arabic-Indic digits without claiming validity", () => {
    const lookup = prepareBusinessIdentifierLookup("٧٠٠١٢٣٤٥٦٧", "SA");
    expect(lookup.normalized).toBe("7001234567");
    expect(lookup.structurallyValid).toBeNull();
  });
});
