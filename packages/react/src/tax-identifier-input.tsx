import {
  normalizeTaxIdentifier,
  validateTaxIdentifier,
  type TaxIdentifierCountryCode,
  type TaxIdentifierKind,
  type TaxIdentifierValidationResult
} from "@arabdevkit/core";
import type { ChangeEvent, InputHTMLAttributes } from "react";

export interface TaxIdentifierInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  country: TaxIdentifierCountryCode;
  kind: TaxIdentifierKind;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, state: TaxIdentifierValidationResult, event: ChangeEvent<HTMLInputElement>) => void;
  onValidityChange?: (state: TaxIdentifierValidationResult) => void;
}

export function getTaxIdentifierInputState(value: string, country: TaxIdentifierCountryCode, kind: TaxIdentifierKind) {
  return validateTaxIdentifier(value, country, kind);
}

export function TaxIdentifierInput({
  country,
  kind,
  value,
  defaultValue,
  onValueChange,
  onValidityChange,
  inputMode,
  "aria-invalid": ariaInvalid,
  ...props
}: TaxIdentifierInputProps) {
  const controlledState = value !== undefined ? validateTaxIdentifier(value, country, kind) : null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeTaxIdentifier(event.currentTarget.value);
    const state = validateTaxIdentifier(normalized, country, kind);
    onValueChange?.(normalized, state, event);
    onValidityChange?.(state);
  };

  return (
    <input
      {...props}
      type="text"
      value={value}
      defaultValue={defaultValue}
      inputMode={inputMode ?? "numeric"}
      dir="ltr"
      data-arabdevkit-country={country}
      data-arabdevkit-field="tax-identifier"
      data-arabdevkit-tax-kind={kind}
      aria-invalid={ariaInvalid ?? (controlledState && value ? !controlledState.valid : undefined)}
      onChange={handleChange}
    />
  );
}
