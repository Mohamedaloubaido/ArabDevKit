import {
  formatIban,
  isArabIbanCountryCode,
  normalizeIban,
  validateIban,
  type ArabIbanCountryCode,
  type IbanValidationResult
} from "@arabdevkit/core";
import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from "react";

export interface IbanInputState extends IbanValidationResult {
  formatted: string;
}

export interface IbanInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  country?: ArabIbanCountryCode;
  value?: string;
  defaultValue?: string;
  formatOnChange?: boolean;
  formatOnBlur?: boolean;
  onValueChange?: (value: string, state: IbanInputState, event: ChangeEvent<HTMLInputElement>) => void;
  onValidityChange?: (state: IbanInputState) => void;
}

export function getIbanInputState(value: string, country?: ArabIbanCountryCode): IbanInputState {
  const validation = validateIban(value, country);
  return {
    ...validation,
    formatted: formatIban(value)
  };
}

export function IbanInput({
  country,
  value,
  defaultValue,
  formatOnChange = true,
  formatOnBlur = true,
  onValueChange,
  onValidityChange,
  onBlur,
  inputMode,
  autoCapitalize,
  spellCheck,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: IbanInputProps) {
  const controlled = value !== undefined;
  const controlledState = controlled ? getIbanInputState(value, country) : null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.currentTarget.value;
    const nextValue = formatOnChange ? formatIban(raw) : normalizeIban(raw);
    if (!controlled && formatOnChange) event.currentTarget.value = nextValue;
    const state = getIbanInputState(nextValue, country);
    onValueChange?.(nextValue, state, event);
    onValidityChange?.(state);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (formatOnBlur && !controlled && event.currentTarget.value) {
      event.currentTarget.value = formatIban(event.currentTarget.value);
    }
    onBlur?.(event);
  };

  const inferredCountry = value ? normalizeIban(value).slice(0, 2) : "";
  const market = country ?? (isArabIbanCountryCode(inferredCountry) ? inferredCountry : undefined);

  return (
    <input
      {...inputProps}
      type="text"
      value={value}
      defaultValue={defaultValue}
      inputMode={inputMode ?? "text"}
      autoCapitalize={autoCapitalize ?? "characters"}
      spellCheck={spellCheck ?? false}
      dir="ltr"
      data-arabdevkit-country={market}
      data-arabdevkit-field="iban"
      aria-invalid={ariaInvalid ?? (controlledState && value ? !controlledState.valid : undefined)}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
