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
  type ArabCountryCode,
  type ArabIbanCountryCode
} from "@arabdevkit/core";

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
  arabdevkit normalize <TEXT> [--json]
  arabdevkit --version

Examples:
  arabdevkit country SA
  arabdevkit iban "SA03 8000 0000 6080 1016 7519" --country SA
  arabdevkit phone "0501234567" --country SA
  arabdevkit normalize "إِلَى السُّعُودِيَّةِ ١٢٣"
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

export function runCli(args: string[]): void {
  if (args.length === 0 || hasFlag(args, "--help") || hasFlag(args, "-h")) return usage();
  if (hasFlag(args, "--version") || hasFlag(args, "-v")) return console.log(VERSION);

  const [command, ...rest] = args;
  switch (command) {
    case "country": return countryCommand(rest);
    case "iban": return ibanCommand(rest);
    case "phone": return phoneCommand(rest);
    case "normalize": return normalizeCommand(rest);
    default:
      fail(`Unknown command: ${command}. Run arabdevkit --help.`);
  }
}

runCli(process.argv.slice(2));
