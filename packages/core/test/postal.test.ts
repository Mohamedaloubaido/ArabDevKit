import { describe, expect, it } from "vitest";
import { getPostalProfile, validatePostalCode } from "../src/index.js";

describe("postal profiles", () => {
  it("validates Saudi National Address postal codes structurally", () => {
    expect(validatePostalCode("١٣٣٣٧", "SA")).toMatchObject({ valid: true, normalized: "13337" });
    expect(validatePostalCode("1333", "SA").reason).toBe("invalid-length");
  });

  it("does not invent a UAE postal code format", () => {
    expect(getPostalProfile("AE").support).toBe("po-box");
    expect(validatePostalCode("00000", "AE").reason).toBe("not-used");
  });

  it("keeps unsourced markets explicitly unverified", () => {
    expect(getPostalProfile("SY").support).toBe("unverified");
    expect(validatePostalCode("12345", "SY").reason).toBe("unverified-country");
  });
});
