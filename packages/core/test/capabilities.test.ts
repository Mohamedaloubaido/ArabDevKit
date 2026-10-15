import { describe, expect, it } from "vitest";
import { getCountryCapabilities, listCountryCapabilities } from "../src/index.js";

describe("country capability matrix", () => {
  it("summarizes Saudi capabilities from configured modules", () => {
    expect(getCountryCapabilities("SA")).toMatchObject({
      address: "structured",
      subdivisionCount: 13,
      iban: true,
      postal: "postal-code",
      taxIdentifiers: ["vat", "tin"],
      businessRegistry: "verification-only"
    });
  });

  it("distinguishes UAE PO Box behavior", () => {
    expect(getCountryCapabilities("AE")).toMatchObject({
      address: "structured",
      subdivisionCount: 7,
      iban: true,
      postal: "po-box",
      taxIdentifiers: ["trn"],
      businessRegistry: "verification-only"
    });
  });

  it("keeps unsourced capabilities explicit", () => {
    expect(getCountryCapabilities("SY")).toMatchObject({
      address: "structured",
      subdivisionCount: 14,
      iban: false,
      postal: "unverified",
      taxIdentifiers: [],
      businessRegistry: null
    });
  });

  it("covers all 22 Arab market profiles", () => {
    expect(listCountryCapabilities()).toHaveLength(22);
  });
});
