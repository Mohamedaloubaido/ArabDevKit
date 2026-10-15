import {
  formatPhoneE164,
  formatPhoneNational,
  getCountry,
  isValidPhone,
  toLatinDigits,
  type ArabCountryCode
} from "@arabdevkit/core";
import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";

export interface PhoneInputState {
  raw: string;
  normalizedDigits: string;
  valid: boolean;
  e164: string | null;
  national: string | null;
  country: ArabCountryCode;
}

export interface ArabPhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
  country: ArabCountryCode;
  value?: string;
  defaultValue?: string;
  formatOnBlur?: boolean;
  onValueChange?: (value: string, state: PhoneInputState, event: ChangeEvent<HTMLInputElement>) => void;
  onValidityChange?: (state: PhoneInputState) => void;
}

export function getPhoneInputState(value: string, country: ArabCountryCode): PhoneInputState {
  const valid = isValidPhone(value, country);
  return {
    raw: value,
    normalizedDigits: toLatinDigits(value),
    valid,
    e164: valid ? formatPhoneE164(value, country) : null,
    national: valid ? formatPhoneNational(value, country) : null,
    country
  };
}

export function ArabPhoneInput({
  country,
  value,
  defaultValue,
  formatOnBlur = false,
  onValueChange,
  onValidityChange,
  onBlur,
  inputMode,
  autoComplete,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: ArabPhoneInputProps) {
  const countryProfile = getCountry(country);
  const controlled = value !== undefined;
  const controlledState = controlled ? getPhoneInputState(value, country) : null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    const state = getPhoneInputState(nextValue, country);
    onValueChange?.(nextValue, state, event);
    onValidityChange?.(state);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (formatOnBlur && !controlled) {
      const formatted = formatPhoneNational(event.currentTarget.value, country);
      if (formatted && event.currentTarget.value !== formatted) {
        event.currentTarget.value = formatted;
      }
    }
    onBlur?.(event);
  };

  return (
    <input
      {...inputProps}
      type="tel"
      value={value}
      defaultValue={defaultValue}
      inputMode={inputMode ?? "tel"}
      autoComplete={autoComplete ?? "tel"}
      data-arabdevkit-country={country}
      data-arabdevkit-calling-code={countryProfile.callingCode}
      aria-invalid={ariaInvalid ?? (controlledState && value ? !controlledState.valid : undefined)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
