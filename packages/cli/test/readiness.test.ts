import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { auditProjectReadiness } from "../src/readiness.js";

const roots: string[] = [];

function project(): string {
  const root = mkdtempSync(join(tmpdir(), "arabdevkit-readiness-"));
  roots.push(root);
  mkdirSync(join(root, "src"));
  return root;
}

afterEach(() => {
  while (roots.length) {
    rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("country readiness audit", () => {
  it("detects Saudi localization signals in source and config files", () => {
    const root = project();

    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ i18n: { locales: ["ar-SA", "en"] } })
    );
    writeFileSync(
      join(root, "src", "app.tsx"),
      `
        import { formatMoney, formatPhoneE164, isValidIban, toLatinDigits } from "@arabdevkit/core";
        export const market = { country: "SA", currency: "SAR" };
        export const Example = () => <main dir="rtl">مرحبا ١٢٣</main>;
        formatPhoneE164("0501234567", "SA");
        isValidIban("SA0380000000608010167519", "SA");
        toLatinDigits("١٢٣");
        formatMoney(10, "SA");
      `
    );

    const report = auditProjectReadiness("SA", root);

    expect(report.filesScanned).toBe(2);
    expect(report.heuristicScore).toBe(100);
    expect(report.signals.every((signal) => signal.detected)).toBe(true);
  });

  it("reports missing engineering signals without treating them as certification failures", () => {
    const root = project();
    writeFileSync(join(root, "src", "server.ts"), `export const health = "ok";`);

    const report = auditProjectReadiness("AE", root);

    expect(report.heuristicScore).toBe(0);
    expect(report.disclaimer).toMatch(/not a legal/i);
    expect(report.signals.some((signal) => signal.id === "rtl" && !signal.detected)).toBe(true);
  });

  it("ignores generated and dependency directories", () => {
    const root = project();
    mkdirSync(join(root, "node_modules"));
    writeFileSync(join(root, "node_modules", "fake.ts"), `const locale = "ar-SA";`);
    writeFileSync(join(root, "src", "index.ts"), `export const value = true;`);

    const report = auditProjectReadiness("SA", root);

    expect(report.filesScanned).toBe(1);
    expect(report.signals.find((signal) => signal.id === "locale")?.detected).toBe(false);
  });
});
