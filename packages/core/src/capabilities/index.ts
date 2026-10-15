import { getAddressSpec } from "../address/index.js";
import { getBusinessRegistrySpec, type BusinessRegistrySpec } from "../business/index.js";
import { listCountries, type ArabCountryCode } from "../countries/index.js";
import { isArabIbanCountryCode } from "../iban/index.js";
import { getPostalProfile, type PostalSupportMode } from "../postal/index.js";
import { listTaxIdentifierSpecs, type TaxIdentifierKind } from "../tax/index.js";

export interface CountryCapabilities {
  countryCode: ArabCountryCode;
  phone: true;
  address: "structured" | "generic";
  subdivisionCount: number;
  iban: boolean;
  postal: PostalSupportMode;
  taxIdentifiers: TaxIdentifierKind[];
  businessRegistry: BusinessRegistrySpec["validationMode"] | null;
}

export function getCountryCapabilities(countryCode: ArabCountryCode): CountryCapabilities {
  const address = getAddressSpec(countryCode);
  const taxIdentifiers = listTaxIdentifierSpecs()
    .filter((spec) => spec.countryCode === countryCode)
    .map((spec) => spec.kind);
  const businessRegistry = countryCode === "SA" || countryCode === "AE"
    ? getBusinessRegistrySpec(countryCode)
    : null;

  return {
    countryCode,
    phone: true,
    address: address.support,
    subdivisionCount: address.subdivisions.length,
    iban: isArabIbanCountryCode(countryCode),
    postal: getPostalProfile(countryCode).support,
    taxIdentifiers,
    businessRegistry: businessRegistry?.validationMode ?? null
  };
}

export function listCountryCapabilities(): CountryCapabilities[] {
  return listCountries().map((country) => getCountryCapabilities(country.code));
}
