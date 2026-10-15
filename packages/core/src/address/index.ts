import type { ArabCountryCode } from "../countries/types.js";
import { toLatinDigits } from "../number/digits.js";
import {
  AE_EMIRATES,
  EG_GOVERNORATES,
  SA_REGIONS,
  STRUCTURED_SUBDIVISIONS,
  SY_GOVERNORATES,
  type AddressSubdivision
} from "./data.js";

export type AddressFieldId =
  | "addressLine1"
  | "addressLine2"
  | "buildingNumber"
  | "street"
  | "unit"
  | "district"
  | "city"
  | "subdivision"
  | "postalCode"
  | "secondaryNumber"
  | "shortAddress"
  | "poBox";

export interface AddressFieldSpec {
  id: AddressFieldId;
  label: string;
  labelAr: string;
  required: boolean;
  autocomplete?: string;
  inputMode?: "text" | "numeric";
  pattern?: RegExp;
  hint?: string;
  hintAr?: string;
}

export interface CountryAddressSpec {
  country: ArabCountryCode;
  support: "generic" | "structured";
  fields: readonly AddressFieldSpec[];
  subdivisionLabel: string;
  subdivisionLabelAr: string;
  subdivisions: readonly AddressSubdivision[];
  notes: readonly string[];
}

export type AddressValue = Partial<Record<AddressFieldId, string>>;

export interface AddressFieldValidation {
  field: AddressFieldId;
  valid: boolean;
  reason: "required" | "invalid-format" | "unknown-subdivision" | null;
}

export interface AddressValidationResult {
  valid: boolean;
  fields: AddressFieldValidation[];
}

const genericFields: readonly AddressFieldSpec[] = [
  { id: "addressLine1", label: "Address line 1", labelAr: "العنوان", required: true, autocomplete: "address-line1" },
  { id: "addressLine2", label: "Address line 2", labelAr: "تفاصيل إضافية", required: false, autocomplete: "address-line2" },
  { id: "city", label: "City", labelAr: "المدينة", required: true, autocomplete: "address-level2" },
  { id: "subdivision", label: "Region / Province", labelAr: "المنطقة / المحافظة", required: false, autocomplete: "address-level1" },
  { id: "postalCode", label: "Postal code", labelAr: "الرمز البريدي", required: false, autocomplete: "postal-code" }
];

const saudiFields: readonly AddressFieldSpec[] = [
  { id: "buildingNumber", label: "Building number", labelAr: "رقم المبنى", required: true, inputMode: "numeric", pattern: /^\d{4}$/, hint: "4 digits", hintAr: "4 أرقام" },
  { id: "street", label: "Street", labelAr: "الشارع", required: true, autocomplete: "address-line1" },
  { id: "district", label: "District", labelAr: "الحي", required: true, autocomplete: "address-level3" },
  { id: "city", label: "City", labelAr: "المدينة", required: true, autocomplete: "address-level2" },
  { id: "subdivision", label: "Region", labelAr: "المنطقة", required: false, autocomplete: "address-level1" },
  { id: "postalCode", label: "Postal code", labelAr: "الرمز البريدي", required: true, autocomplete: "postal-code", inputMode: "numeric", pattern: /^\d{5}$/, hint: "5 digits", hintAr: "5 أرقام" },
  { id: "secondaryNumber", label: "Secondary number", labelAr: "الرقم الفرعي", required: true, inputMode: "numeric", pattern: /^\d{4}$/, hint: "4 digits", hintAr: "4 أرقام" },
  { id: "shortAddress", label: "Short address", labelAr: "العنوان المختصر", required: false, pattern: /^[A-Z]{4}\d{4}$/, hint: "4 letters + 4 digits", hintAr: "4 أحرف + 4 أرقام" }
];

const uaeFields: readonly AddressFieldSpec[] = [
  { id: "poBox", label: "P.O. Box", labelAr: "صندوق البريد", required: false, inputMode: "numeric" },
  { id: "buildingNumber", label: "Building name / number", labelAr: "اسم / رقم المبنى", required: true, autocomplete: "address-line1" },
  { id: "street", label: "Street", labelAr: "الشارع", required: true, autocomplete: "address-line1" },
  { id: "unit", label: "Flat / unit", labelAr: "الشقة / الوحدة", required: false, autocomplete: "address-line2" },
  { id: "city", label: "City / area", labelAr: "المدينة / المنطقة", required: true, autocomplete: "address-level2" },
  { id: "subdivision", label: "Emirate", labelAr: "الإمارة", required: true, autocomplete: "address-level1" }
];

const egyptFields: readonly AddressFieldSpec[] = [
  { id: "addressLine1", label: "Street / building", labelAr: "الشارع / المبنى", required: true, autocomplete: "address-line1" },
  { id: "district", label: "District", labelAr: "الحي / المركز", required: false, autocomplete: "address-level3" },
  { id: "city", label: "City", labelAr: "المدينة", required: true, autocomplete: "address-level2" },
  { id: "subdivision", label: "Governorate", labelAr: "المحافظة", required: true, autocomplete: "address-level1" },
  { id: "postalCode", label: "Postal code", labelAr: "الرمز البريدي", required: false, autocomplete: "postal-code", inputMode: "numeric" }
];

const syriaFields: readonly AddressFieldSpec[] = [
  { id: "addressLine1", label: "Street / building", labelAr: "الشارع / المبنى", required: true, autocomplete: "address-line1" },
  { id: "district", label: "District / neighborhood", labelAr: "الحي / المنطقة", required: false, autocomplete: "address-level3" },
  { id: "city", label: "City / town", labelAr: "المدينة / البلدة", required: true, autocomplete: "address-level2" },
  { id: "subdivision", label: "Governorate", labelAr: "المحافظة", required: true, autocomplete: "address-level1" }
];

const structuredSpecs: Partial<Record<ArabCountryCode, CountryAddressSpec>> = {
  SA: {
    country: "SA",
    support: "structured",
    fields: saudiFields,
    subdivisionLabel: "Region",
    subdivisionLabelAr: "المنطقة",
    subdivisions: SA_REGIONS,
    notes: ["Saudi National Address field structure."]
  },
  AE: {
    country: "AE",
    support: "structured",
    fields: uaeFields,
    subdivisionLabel: "Emirate",
    subdivisionLabelAr: "الإمارة",
    subdivisions: AE_EMIRATES,
    notes: ["UAE shipping-address structure uses P.O. Box and physical address components; no postal-code field is asserted here."]
  },
  EG: {
    country: "EG",
    support: "structured",
    fields: egyptFields,
    subdivisionLabel: "Governorate",
    subdivisionLabelAr: "المحافظة",
    subdivisions: EG_GOVERNORATES,
    notes: ["Governorate-aware address structure; postal-code validation is intentionally not asserted yet."]
  },
  SY: {
    country: "SY",
    support: "structured",
    fields: syriaFields,
    subdivisionLabel: "Governorate",
    subdivisionLabelAr: "المحافظة",
    subdivisions: SY_GOVERNORATES,
    notes: ["Governorate-aware address structure; no national postal-code rule is asserted yet."]
  }
};

function normalizeFieldValue(field: AddressFieldId, value: string): string {
  const trimmed = value.trim();
  if (["buildingNumber", "postalCode", "secondaryNumber", "poBox"].includes(field)) {
    return toLatinDigits(trimmed).replace(/\s+/g, "");
  }
  if (field === "shortAddress") {
    return toLatinDigits(trimmed).replace(/\s+/g, "").toUpperCase();
  }
  return trimmed.replace(/\s+/g, " ");
}

export function getAddressSpec(country: ArabCountryCode): CountryAddressSpec {
  return structuredSpecs[country] ?? {
    country,
    support: "generic",
    fields: genericFields,
    subdivisionLabel: "Region / Province",
    subdivisionLabelAr: "المنطقة / المحافظة",
    subdivisions: STRUCTURED_SUBDIVISIONS[country] ?? [],
    notes: ["Generic address profile. Country-specific postal and administrative rules are not asserted yet."]
  };
}

export function listAddressSubdivisions(country: ArabCountryCode): AddressSubdivision[] {
  return [...getAddressSpec(country).subdivisions];
}

export function normalizeAddress(country: ArabCountryCode, address: AddressValue): AddressValue {
  const spec = getAddressSpec(country);
  const normalized: AddressValue = {};
  for (const field of spec.fields) {
    const value = address[field.id];
    if (value !== undefined) normalized[field.id] = normalizeFieldValue(field.id, value);
  }
  return normalized;
}

export function validateAddressField(
  country: ArabCountryCode,
  fieldId: AddressFieldId,
  value: string | undefined
): AddressFieldValidation {
  const spec = getAddressSpec(country);
  const field = spec.fields.find((item) => item.id === fieldId);
  if (!field) return { field: fieldId, valid: true, reason: null };

  const normalized = normalizeFieldValue(fieldId, value ?? "");
  if (!normalized) {
    return field.required
      ? { field: fieldId, valid: false, reason: "required" }
      : { field: fieldId, valid: true, reason: null };
  }

  if (field.pattern && !field.pattern.test(normalized)) {
    return { field: fieldId, valid: false, reason: "invalid-format" };
  }

  if (fieldId === "subdivision" && spec.subdivisions.length > 0) {
    const lookup = normalized.toLocaleLowerCase("en");
    const known = spec.subdivisions.some((item) =>
      item.id.toLocaleLowerCase("en") === lookup ||
      item.name.toLocaleLowerCase("en") === lookup ||
      item.nameAr === normalized
    );
    if (!known) return { field: fieldId, valid: false, reason: "unknown-subdivision" };
  }

  return { field: fieldId, valid: true, reason: null };
}

export function validateAddress(country: ArabCountryCode, address: AddressValue): AddressValidationResult {
  const spec = getAddressSpec(country);
  const fields = spec.fields.map((field) => validateAddressField(country, field.id, address[field.id]));
  return { valid: fields.every((field) => field.valid), fields };
}

export function getAddressFieldSpec(country: ArabCountryCode, field: AddressFieldId): AddressFieldSpec | null {
  return getAddressSpec(country).fields.find((item) => item.id === field) ?? null;
}

export {
  AE_EMIRATES,
  EG_GOVERNORATES,
  SA_REGIONS,
  SY_GOVERNORATES
} from "./data.js";
export type { AddressSubdivision } from "./data.js";
