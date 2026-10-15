import { toLatinDigits } from "../number/index.js";

export type BusinessRegistryCountryCode = "SA" | "AE";
export type BusinessRegistryKind = "commercial-registration" | "economic-license";

export interface BusinessRegistrySpec {
  countryCode: BusinessRegistryCountryCode;
  kind: BusinessRegistryKind;
  label: string;
  authority: string;
  validationMode: "verification-only";
  searchBy: readonly string[];
  verificationUrl: string;
  sourceUrl: string;
  notes: string;
}

export interface BusinessIdentifierLookup {
  countryCode: BusinessRegistryCountryCode;
  kind: BusinessRegistryKind;
  normalized: string | null;
  structurallyValid: null;
  authoritativeVerificationRequired: true;
  verificationUrl: string;
  authority: string;
}

const BUSINESS_REGISTRIES: readonly BusinessRegistrySpec[] = [
  {
    countryCode: "SA",
    kind: "commercial-registration",
    label: "Commercial Registration / Unified National Number",
    authority: "Ministry of Commerce",
    validationMode: "verification-only",
    searchBy: ["establishment name", "unified national number"],
    verificationUrl: "https://mc.gov.sa/en/eservices/pages/ServiceDetails.aspx?sID=91",
    sourceUrl: "https://mc.gov.sa/en/eservices/pages/ServiceDetails.aspx?sID=91",
    notes: "ArabDevKit does not infer a complete identifier format. Use the Ministry of Commerce query service for authoritative registration data."
  },
  {
    countryCode: "AE",
    kind: "economic-license",
    label: "Economic / Trade Licence",
    authority: "Ministry of Economy and Tourism / National Economic Register",
    validationMode: "verification-only",
    searchBy: ["economic name", "local licence number", "economic register number"],
    verificationUrl: "https://ner.economy.ae/",
    sourceUrl: "https://u.ae/en/information-and-services/business/important-digital-services/national-economic-register",
    notes: "Licence identifiers can be issued by multiple local licensing authorities. Use the National Economic Register or the issuing emirate authority for authoritative verification."
  }
] as const;

export function normalizeBusinessIdentifier(value: string): string {
  return toLatinDigits(value).trim().replace(/\s+/g, " ");
}

export function listBusinessRegistrySpecs(): BusinessRegistrySpec[] {
  return BUSINESS_REGISTRIES.map((spec) => ({ ...spec, searchBy: [...spec.searchBy] }));
}

export function getBusinessRegistrySpec(
  countryCode: BusinessRegistryCountryCode,
  kind?: BusinessRegistryKind
): BusinessRegistrySpec | null {
  return BUSINESS_REGISTRIES.find(
    (spec) => spec.countryCode === countryCode && (kind === undefined || spec.kind === kind)
  ) ?? null;
}

export function prepareBusinessIdentifierLookup(
  value: string | undefined,
  countryCode: BusinessRegistryCountryCode,
  kind?: BusinessRegistryKind
): BusinessIdentifierLookup {
  const spec = getBusinessRegistrySpec(countryCode, kind);
  if (!spec) {
    throw new RangeError(`No business registry verifier configured for ${countryCode}${kind ? `/${kind}` : ""}`);
  }

  const normalized = value === undefined || value.trim() === ""
    ? null
    : normalizeBusinessIdentifier(value);

  return {
    countryCode,
    kind: spec.kind,
    normalized,
    structurallyValid: null,
    authoritativeVerificationRequired: true,
    verificationUrl: spec.verificationUrl,
    authority: spec.authority
  };
}
