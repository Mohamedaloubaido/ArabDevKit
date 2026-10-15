#!/usr/bin/env node

import {
  formatPhoneE164,
  formatPhoneNational,
  getArabIbanSpec,
  getCountry,
  isArabCountryCode,
  isArabIbanCountryCode,
  isValidPhone,
  normalizeArabic,
  parseIban,
  toLatinDigits,
  validateIban,
  validateTaxIdentifier,
  type ArabCountryCode,
  type ArabIbanCountryCode,
  type TaxIdentifierKind
} from "@arabdevkit/core";
import { createArabFaker } from "@arabdevkit/faker";
import { auditProjectReadiness } from "./readiness.js";

const VERSION = "0.1.0";

function option(args: string[], name: string): string | null {
  const index = args.indexOf(name);
  return index >= 0 && index + 1 < args.length ? args[index + 1] ?? null : null;
}

function hasFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function fail(message: string): never {
  console.error(`ArabDevKit: ${message}`);
  process.exit(1);
  throw new Error("unreachable");
}

function usage(): void {
  console.log(`ArabDevKit CLI v${VERSION}

Usage:
  arabdevkit country <CODE> [--json]
  arabdevkit iban <IBAN> [--country <CODE>] [--json]
  arabdevkit phone <NUMBER> --country <CODE> [--json]
  arabdevkit tax <VALUE> --country <SA|AE> --kind <vat|tin|trn> [--json]
  arabdevkit normalize <TEXT> [--json]
  arabdevkit check --country <CODE> [--path <PATH>] [--json]
  arabdevkit fake <person|address|company|phone|iban> --country <CODE> [--count <N>] [--seed <N>] [--json]
  arabdevkit --version

Examples:
  arabdevkit country SA
  arabdevkit iban "SA03 8000 0000 6080 1016 7519" --country SA
  arabdevkit phone "0501234567" --country SA
  arabdevkit tax "310122393500003" --country SA --kind vat
  arabdevkit normalize "إِلَى السُّعُودِيَّةِ ١٢٣"
  arabdevkit check --country SA --path .
  arabdevkit fake person --country SA --count 3 --seed 42
`);
}

function asCountryCode(value: string | null): ArabCountryCode {
  if (!value || !isArabCountryCode(value)) fail(`Unknown Arab country code: ${value ?? "<missing>"}`);
  return value.toUpperCase() as ArabCountryCode;
}

function asIbanCountryCode(value: string | null): ArabIbanCountryCode {
  if (!value || !isArabIbanCountryCode(value)) {
    fail(`Country does not have a configured ArabDevKit IBAN format: ${value ?? "<missing>"}`);
  }
  return value.toUpperCase() as ArabIbanCountryCode;
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function countryCommand(args: string[]): void {
  const code = asCountryCode(args[0] ?? null);
  const country = getCountry(code);
  const iban = isArabIbanCountryCode(code) ? getArabIbanSpec(code) : null;
  const payload = { ...country, capabilities: { iban: Boolean(iban) }, iban };

  if (hasFlag(args, "--json")) return printJson(payload);

  console.log(`${country.name} — ${country.nameAr}`);
  console.log(`ISO: ${country.code} / ${country.iso3}`);
  console.log(`Calling code: ${country.callingCode}`);
  console.log(`Locales: ${country.locales.join(", ")}`);
  console.log(`Currencies: ${country.currencies.join(", ")}`);
  console.log(`IBAN: ${iban ? `supported (${iban.ibanLength} chars)` : "not configured"}`);
}

function ibanCommand(args: string[]): void {
  const input = args[0];
  if (!input) fail("Missing IBAN value.");

  const expectedRaw = option(args, "--country");
  const expected = expectedRaw ? asIbanCountryCode(expectedRaw) : undefined;
  const result = validateIban(input, expected);
  const parsed = result.valid ? parseIban(input) : null;
  const payload = { ...result, parsed };

  if (hasFlag(args, "--json")) printJson(payload);
  else if (result.valid && parsed) {
    console.log("✓ Valid IBAN");
    console.log(`Country: ${parsed.countryCode}`);
    console.log(`IBAN: ${parsed.formatted}`);
    console.log(`Bank identifier: ${parsed.bankIdentifier}`);
    if (parsed.branchIdentifier) console.log(`Branch identifier: ${parsed.branchIdentifier}`);
  } else {
    console.log(`✗ Invalid IBAN (${result.reason ?? "unknown"})`);
  }

  if (!result.valid) process.exitCode = 1;
}

function phoneCommand(args: string[]): void {
  const input = args[0];
  if (!input) fail("Missing phone number.");
  const country = asCountryCode(option(args, "--country"));
  const valid = isValidPhone(input, country);
  const payload = {
    valid,
    country,
    e164: valid ? formatPhoneE164(input, country) : null,
    national: valid ? formatPhoneNational(input, country) : null
  };

  if (hasFlag(args, "--json")) printJson(payload);
  else if (valid) {
    console.log("✓ Valid phone number");
    console.log(`Country: ${country}`);
    console.log(`E.164: ${payload.e164}`);
    console.log(`National: ${payload.national}`);
  } else {
    console.log(`✗ Invalid ${country} phone number`);
  }

  if (!valid) process.exitCode = 1;
}

function taxCommand(args: string[]): void {
  const input = args[0];
  if (!input) fail("Missing tax identifier value.");
  const countryRaw = option(args, "--country")?.toUpperCase();
  if (countryRaw !== "SA" && countryRaw !== "AE") fail("Tax identifiers are currently configured for SA and AE only.");
  const kindRaw = option(args, "--kind")?.toLowerCase();
  if (kindRaw !== "vat" && kindRaw !== "tin" && kindRaw !== "trn") fail("--kind must be vat, tin, or trn.");
  const result = validateTaxIdentifier(input, countryRaw, kindRaw as TaxIdentifierKind);
  if (hasFlag(args, "--json")) return printJson(result);
  console.log(`${result.valid ? "✓" : "✗"} ${result.valid ? "Structurally valid" : "Invalid"} ${countryRaw} ${kindRaw.toUpperCase()}`);
  console.log(`Normalized: ${result.normalized}`);
  console.log("Note: structural validation only; official registration status is not verified.");
  if (result.verificationUrl) console.log(`Official verification: ${result.verificationUrl}`);
  if (!result.valid) process.exitCode = 1;
}

function normalizeCommand(args: string[]): void {
  const text = args.filter((arg) => arg !== "--json").join(" ");
  if (!text) fail("Missing text.");

  const payload = {
    input: text,
    normalizedArabic: normalizeArabic(text),
    latinDigits: toLatinDigits(normalizeArabic(text))
  };

  if (hasFlag(args, "--json")) printJson(payload);
  else console.log(payload.latinDigits);
}

function checkCommand(args: string[]): void {
  const country = asCountryCode(option(args, "--country"));
  const path = option(args, "--path") ?? ".";
  const report = auditProjectReadiness(country, path);

  if (hasFlag(args, "--json")) return printJson(report);

  console.log(`ArabDevKit Readiness Audit — ${report.country} (${report.countryName})`);
  console.log(`Path: ${report.root}`);
  console.log(`Heuristic score: ${report.heuristicScore}/100`);
  console.log(`Files scanned: ${report.filesScanned}${report.truncated ? "+ (scan limit reached)" : ""}`);
  console.log("");

  for (const signal of report.signals) {
    console.log(`${signal.detected ? "✓" : "⚠"} ${signal.label} — ${signal.detected ? signal.weight : 0}/${signal.weight}`);
    if (!signal.detected) console.log(`  ${signal.recommendation}`);
  }

  console.log("");
  console.log(report.disclaimer);
}

function fakeCommand(args: string[]): void {
  const entity = args[0];
  if (!entity || !["person", "address", "company", "phone", "iban"].includes(entity)) {
    fail("Fake entity must be one of: person, address, company, phone, iban.");
  }

  const country = asCountryCode(option(args, "--country"));
  const countRaw = option(args, "--count") ?? "1";
  const count = Number(countRaw);
  if (!Number.isInteger(count) || count < 1 || count > 1000) fail("--count must be an integer between 1 and 1000.");

  const seedRaw = option(args, "--seed");
  let seed: number | undefined;
  if (seedRaw !== null) {
    const parsedSeed = Number(seedRaw);
    if (!Number.isInteger(parsedSeed)) fail("--seed must be an integer.");
    seed = parsedSeed;
  }

  const fake = createArabFaker(country, seed === undefined ? {} : { seed });
  const make = () => {
    switch (entity) {
      case "person": return fake.person();
      case "address": return fake.address();
      case "company": return fake.company();
      case "phone": return fake.phone();
      case "iban": return fake.iban();
      default: return null;
    }
  };

  const values = Array.from({ length: count }, make);
  const payload = count === 1 ? values[0] : values;

  if (hasFlag(args, "--json")) return printJson(payload);

  for (const value of values) {
    if (value === null) console.log(`${entity}: unavailable for ${country}`);
    else if (typeof value === "object") console.log(JSON.stringify(value, null, 2));
    else console.log(String(value));
  }
}

export function runCli(args: string[]): void {
  if (args.length === 0 || hasFlag(args, "--help") || hasFlag(args, "-h")) return usage();
  if (hasFlag(args, "--version") || hasFlag(args, "-v")) return console.log(VERSION);

  const [command, ...rest] = args;
  switch (command) {
    case "country": return countryCommand(rest);
    case "iban": return ibanCommand(rest);
    case "phone": return phoneCommand(rest);
    case "tax": return taxCommand(rest);
    case "normalize": return normalizeCommand(rest);
    case "check": return checkCommand(rest);
    case "fake": return fakeCommand(rest);
    default:
      fail(`Unknown command: ${command}. Run arabdevkit --help.`);
  }
}

runCli(process.argv.slice(2));
