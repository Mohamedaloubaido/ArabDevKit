import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import {
  getCountry,
  isArabIbanCountryCode,
  type ArabCountryCode
} from "@arabdevkit/core";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".output",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "vendor"
]);

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".css", ".dart", ".go", ".html", ".java", ".js", ".json",
  ".jsx", ".kt", ".mjs", ".php", ".py", ".rb", ".scss", ".svelte",
  ".ts", ".tsx", ".vue", ".yaml", ".yml"
]);

const ALWAYS_SCAN = new Set([
  "package.json",
  "composer.json",
  "pubspec.yaml",
  "requirements.txt",
  "pyproject.toml"
]);

const MAX_FILES = 1500;
const MAX_FILE_SIZE = 1_000_000;

export interface ReadinessSignal {
  id: string;
  label: string;
  weight: number;
  detected: boolean;
  evidence: string[];
  recommendation: string;
}

export interface ReadinessReport {
  country: ArabCountryCode;
  countryName: string;
  root: string;
  heuristicScore: number;
  filesScanned: number;
  truncated: boolean;
  signals: ReadinessSignal[];
  disclaimer: string;
}

interface SourceCorpus {
  filesScanned: number;
  truncated: boolean;
  records: Array<{ path: string; content: string }>;
}

function isScannableFile(path: string): boolean {
  return ALWAYS_SCAN.has(basename(path)) || TEXT_EXTENSIONS.has(extname(path).toLowerCase());
}

function collectFiles(root: string): SourceCorpus {
  const records: SourceCorpus["records"] = [];
  let truncated = false;

  function walk(directory: string): void {
    if (records.length >= MAX_FILES) {
      truncated = true;
      return;
    }

    let entries: ReturnType<typeof readdirSync>;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (records.length >= MAX_FILES) {
        truncated = true;
        return;
      }

      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(path);
        continue;
      }

      if (!entry.isFile() || !isScannableFile(path)) continue;

      try {
        if (statSync(path).size > MAX_FILE_SIZE) continue;
        records.push({ path, content: readFileSync(path, "utf8") });
      } catch {
        // Ignore files that disappear or become unreadable during the audit.
      }
    }
  }

  walk(root);
  return { filesScanned: records.length, truncated, records };
}

function detect(
  corpus: SourceCorpus,
  patterns: RegExp[],
  maxEvidence = 3
): { detected: boolean; evidence: string[] } {
  const evidence: string[] = [];

  for (const record of corpus.records) {
    if (patterns.some((pattern) => pattern.test(record.content))) {
      evidence.push(record.path);
      if (evidence.length >= maxEvidence) break;
    }
  }

  return { detected: evidence.length > 0, evidence };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function auditProjectReadiness(
  countryCode: ArabCountryCode,
  projectPath = "."
): ReadinessReport {
  const root = resolve(projectPath);
  const country = getCountry(countryCode);
  const corpus = collectFiles(root);

  const localePatterns = country.locales.map(
    (locale) => new RegExp(escapeRegex(locale), "i")
  );
  const currencyPatterns = country.currencies.map(
    (currency) => new RegExp(`\\b${escapeRegex(currency)}\\b`, "i")
  );

  const checks: Array<Omit<ReadinessSignal, "detected" | "evidence"> & { patterns: RegExp[] }> = [
    {
      id: "locale",
      label: "Target Arabic locale",
      weight: 20,
      patterns: [
        ...localePatterns,
        /(?:defaultLocale|locale|locales|i18n)[^\n]{0,80}["'`]ar(?:[-_][A-Z]{2})?["'`]/i
      ],
      recommendation: `Configure an Arabic locale for ${country.code} (${country.locales.join(", ")}).`
    },
    {
      id: "rtl",
      label: "RTL handling",
      weight: 15,
      patterns: [
        /dir\s*=\s*["']rtl["']/i,
        /direction\s*:\s*rtl/i,
        /\b(?:isRtl|isRTL|rtlEnabled|rtl)\b/
      ],
      recommendation: "Add explicit RTL layout handling for Arabic interfaces."
    },
    {
      id: "currency",
      label: "Local currency awareness",
      weight: 15,
      patterns: [
        ...currencyPatterns,
        /formatMoney\s*\(/,
        /Intl\.NumberFormat\s*\(/
      ],
      recommendation: `Use country-aware money formatting for ${country.currencies.join(" / ")}.`
    },
    {
      id: "phone",
      label: "Phone normalization",
      weight: 20,
      patterns: [
        /(?:isValidPhone|formatPhoneE164|parsePhone)\s*\(/,
        /libphonenumber(?:-js)?/i,
        new RegExp(escapeRegex(country.callingCode))
      ],
      recommendation: `Normalize and validate ${country.callingCode} phone numbers instead of relying on a local regex.`
    },
    {
      id: "digits",
      label: "Arabic digit handling",
      weight: 10,
      patterns: [
        /(?:toLatinDigits|toArabicIndicDigits|normalizeArabic)\s*\(/,
        /[٠-٩]/
      ],
      recommendation: "Handle Arabic-Indic digits and Unicode normalization at input boundaries."
    },
    {
      id: "country-data",
      label: "Country-aware configuration",
      weight: 10,
      patterns: [
        /(?:getCountry|isArabCountryCode|@arabdevkit\/core)/,
        new RegExp(`["'\`]${country.code}["'\`]`),
        new RegExp(escapeRegex(country.nameAr))
      ],
      recommendation: `Centralize ${country.code} metadata instead of scattering country constants through the codebase.`
    },
    {
      id: "tax-identifiers",
      label: "Tax identifier handling",
      weight: 10,
      patterns: [
        /(?:validateTaxIdentifier|isValidSaudiVatNumber|isValidSaudiTin|isValidUaeTrn|TaxIdentifierInput)\s*\(?/,
        /@arabdevkit\/(?:core|react|zod)/
      ],
      recommendation: country.code === "SA" || country.code === "AE"
        ? `Use structural ${country.code} tax identifier validation and official authority verification links.`
        : `Do not assume a tax identifier format for ${country.code} until an authoritative specification is configured.`
    },
    {
      id: "address",
      label: "Country-aware address handling",
      weight: 10,
      patterns: [
        /(?:getAddressSpec|validateAddress|normalizeAddress|ArabAddressForm)\s*\(?/,
        /@arabdevkit\/(?:core|react)/,
        /(?:postalCode|postal-code|address-level1|address-level2)/
      ],
      recommendation: `Use a country-aware ${country.code} address model instead of a single global address form.`
    }
  ];

  if (isArabIbanCountryCode(country.code)) {
    checks.push({
      id: "iban",
      label: "IBAN validation",
      weight: 10,
      patterns: [/(?:isValidIban|validateIban|parseIban)\s*\(/, /\bIBAN\b/i],
      recommendation: `Use ISO 13616 structure + MOD-97 validation for ${country.code} IBANs when collecting bank details.`
    });
  } else {
    checks.push({
      id: "iban",
      label: "IBAN capability awareness",
      weight: 10,
      patterns: [/(?:isArabIbanCountryCode|getArabIbanSpec)\s*\(/],
      recommendation: `${country.code} has no ArabDevKit IBAN format configured; avoid assuming every market has a national IBAN format.`
    });
  }

  const signals = checks.map(({ patterns, ...check }) => {
    const result = detect(corpus, patterns);
    return { ...check, ...result };
  });

  const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
  const earned = signals.reduce(
    (sum, signal) => sum + (signal.detected ? signal.weight : 0),
    0
  );

  return {
    country: country.code,
    countryName: country.name,
    root,
    heuristicScore: Math.round((earned / totalWeight) * 100),
    filesScanned: corpus.filesScanned,
    truncated: corpus.truncated,
    signals,
    disclaimer: "Heuristic developer audit only. This is not a legal, regulatory, accessibility, security, or production-readiness certification."
  };
}
