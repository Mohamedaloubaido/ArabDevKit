import { toLatinDigits } from "../number/index.js";

export type TaxIdentifierCountryCode = "SA" | "AE";
export type TaxIdentifierKind = "vat" | "tin" | "trn";
export type TaxIdentifierValidationReason =
  | "unsupported-identifier"
  | "invalid-characters"
  | "invalid-length"
  | null;

export interface TaxIdentifierSpec {
  countryCode: TaxIdentifierCountryCode;
  kind: TaxIdentifierKind;
  label: string;
  authority: string;
  length: number;
  digitsOnly: true;
  structuralOnly: true;
  verificationUrl: string;
  sourceUrl: string;
}

export interface TaxIdentifierValidationResult {
  valid: boolean;
  normalized: string;
  countryCode: TaxIdentifierCountryCode;
  kind: TaxIdentifierKind;
  reason: TaxIdentifierValidationReason;
  structuralOnly: true;
  verificationUrl: string;
}

const SPECS: readonly TaxIdentifierSpec[] = [
  {
    countryCode: "SA",
    kind: "vat",
    label: "VAT / Tax Number",
    authority: "Zakat, Tax and Customs Authority (ZATCA)",
    length: 15,
    digitsOnly: true,
    structuralOnly: true,
    verificationUrl: "https://www.zatca.gov.sa/ar/eServices/Pages/TaxpayerLookup.aspx",
    sourceUrl: "https://zatca.gov.sa/en/HelpCenter/guidelines/Documents/%28SMEs%29%20Guidelines%20%E2%80%93%20Zatca%201.pdf"
  },
  {
    countryCode: "SA",
    kind: "tin",
    label: "Tax Identification Number (TIN)",
    authority: "Zakat, Tax and Customs Authority (ZATCA)",
    length: 10,
    digitsOnly: true,
    structuralOnly: true,
    verificationUrl: "https://www.zatca.gov.sa/ar/eServices/Pages/TaxpayerLookup.aspx",
    sourceUrl: "https://zatca.gov.sa/en/HelpCenter/guidelines/Documents/%28SMEs%29%20Guidelines%20%E2%80%93%20Zatca%201.pdf"
  },
  {
    countryCode: "AE",
    kind: "trn",
    label: "Tax Registration Number (TRN)",
    authority: "Federal Tax Authority (FTA)",
    length: 15,
    digitsOnly: true,
    structuralOnly: true,
    verificationUrl: "https://tax.gov.ae/",
    sourceUrl: "https://tax.gov.ae/DataFolder/Files/Pdf/requirement-document-for-tax-accounting-software.pdf"
  }
] as const;

export function normalizeTaxIdentifier(value: string): string {
  return toLatinDigits(value).replace(/[\s-]+/g, "");
}

export function listTaxIdentifierSpecs(): TaxIdentifierSpec[] {
  return SPECS.map((spec) => ({ ...spec }));
}

export function getTaxIdentifierSpec(
  countryCode: TaxIdentifierCountryCode,
  kind: TaxIdentifierKind
): TaxIdentifierSpec | null {
  return SPECS.find((spec) => spec.countryCode === countryCode && spec.kind === kind) ?? null;
}

export function validateTaxIdentifier(
  value: string,
  countryCode: TaxIdentifierCountryCode,
  kind: TaxIdentifierKind
): TaxIdentifierValidationResult {
  const spec = getTaxIdentifierSpec(countryCode, kind);
  const normalized = normalizeTaxIdentifier(value);

  if (!spec) {
    return {
      valid: false,
      normalized,
      countryCode,
      kind,
      reason: "unsupported-identifier",
      structuralOnly: true,
      verificationUrl: ""
    };
  }

  if (!/^\d+$/.test(normalized)) {
    return { valid: false, normalized, countryCode, kind, reason: "invalid-characters", structuralOnly: true, verificationUrl: spec.verificationUrl };
  }

  if (normalized.length !== spec.length) {
    return { valid: false, normalized, countryCode, kind, reason: "invalid-length", structuralOnly: true, verificationUrl: spec.verificationUrl };
  }

  return { valid: true, normalized, countryCode, kind, reason: null, structuralOnly: true, verificationUrl: spec.verificationUrl };
}

export function isValidSaudiVatNumber(value: string): boolean {
  return validateTaxIdentifier(value, "SA", "vat").valid;
}

export function isValidSaudiTin(value: string): boolean {
  return validateTaxIdentifier(value, "SA", "tin").valid;
}

export function isValidUaeTrn(value: string): boolean {
  return validateTaxIdentifier(value, "AE", "trn").valid;
}
