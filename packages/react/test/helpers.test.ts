import { describe, expect, it } from "vitest";
import {
  getCountryOptions,
  getIbanInputState,
  getPhoneInputState
} from "../src/index.js";

describe("React helpers", () => {
  it("builds localized country options", () => {
    const options = getCountryOptions("ar", ["SA", "AE"], true);
    expect(options).toHaveLength(2);
    expect(options.some((option) => option.code === "SA" && option.label.includes("+966"))).toBe(true);
    expect(options.some((option) => option.code === "AE" && option.label.includes("الإمارات"))).toBe(true);
  });

  it("exposes phone validation state", () => {
    const state = getPhoneInputState("0501234567", "SA");
    expect(state.valid).toBe(true);
    expect(state.e164).toBe("+966501234567");
  });

  it("formats and validates IBAN state", () => {
    const state = getIbanInputState("SA0380000000608010167519", "SA");
    expect(state.valid).toBe(true);
    expect(state.formatted).toBe("SA03 8000 0000 6080 1016 7519");
  });
});
