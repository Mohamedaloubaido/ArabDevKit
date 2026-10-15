import {
  getAddressSpec,
  normalizeAddress,
  validateAddress,
  type AddressFieldId,
  type AddressValue,
  type AddressValidationResult,
  type ArabCountryCode
} from "@arabdevkit/core";
import type { ChangeEvent } from "react";

export interface ArabAddressFormProps {
  country: ArabCountryCode;
  value: AddressValue;
  language?: "ar" | "en";
  disabled?: boolean;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  onAddressChange: (value: AddressValue, validation: AddressValidationResult) => void;
}

export interface AddressFieldViewModel {
  id: AddressFieldId;
  label: string;
  required: boolean;
  inputMode?: "text" | "numeric";
  autocomplete?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

export function getAddressFieldViewModels(
  country: ArabCountryCode,
  language: "ar" | "en" = "en"
): AddressFieldViewModel[] {
  const spec = getAddressSpec(country);
  return spec.fields.map((field) => ({
    id: field.id,
    label: language === "ar" ? field.labelAr : field.label,
    required: field.required,
    inputMode: field.inputMode,
    autocomplete: field.autocomplete,
    hint: language === "ar" ? field.hintAr : field.hint,
    options: field.id === "subdivision" && spec.subdivisions.length
      ? spec.subdivisions.map((item) => ({
          value: item.id,
          label: language === "ar" ? item.nameAr : item.name
        }))
      : undefined
  }));
}

export function ArabAddressForm({
  country,
  value,
  language = "en",
  disabled = false,
  className,
  fieldClassName,
  labelClassName,
  inputClassName,
  onAddressChange
}: ArabAddressFormProps) {
  const fields = getAddressFieldViewModels(country, language);
  const direction = language === "ar" ? "rtl" : "ltr";

  const update = (field: AddressFieldId, nextValue: string) => {
    const next = normalizeAddress(country, { ...value, [field]: nextValue });
    onAddressChange(next, validateAddress(country, next));
  };

  return (
    <fieldset
      className={className}
      dir={direction}
      disabled={disabled}
      data-arabdevkit-country={country}
      data-arabdevkit-field="address"
    >
      {fields.map((field) => (
        <label key={field.id} className={fieldClassName}>
          <span className={labelClassName}>{field.label}</span>
          {field.options ? (
            <select
              className={inputClassName}
              name={field.id}
              value={value[field.id] ?? ""}
              required={field.required}
              autoComplete={field.autocomplete}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => update(field.id, event.currentTarget.value)}
            >
              <option value="">—</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              className={inputClassName}
              name={field.id}
              value={value[field.id] ?? ""}
              required={field.required}
              inputMode={field.inputMode}
              autoComplete={field.autocomplete}
              aria-describedby={field.hint ? `arabdevkit-${country}-${field.id}-hint` : undefined}
              onChange={(event: ChangeEvent<HTMLInputElement>) => update(field.id, event.currentTarget.value)}
            />
          )}
          {field.hint ? <small id={`arabdevkit-${country}-${field.id}-hint`}>{field.hint}</small> : null}
        </label>
      ))}
    </fieldset>
  );
}
