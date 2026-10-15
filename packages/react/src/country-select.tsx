import {
  listCountries,
  type ArabCountryCode,
  type CountryProfile
} from "@arabdevkit/core";
import type { ChangeEvent, SelectHTMLAttributes } from "react";

export type CountryLabelLanguage = "ar" | "en";

export interface CountryOption {
  code: ArabCountryCode;
  label: string;
  callingCode: string;
  currency: string | null;
}

export interface CountrySelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "defaultValue" | "onChange"> {
  value?: ArabCountryCode;
  defaultValue?: ArabCountryCode;
  language?: CountryLabelLanguage;
  countries?: readonly ArabCountryCode[];
  includeCallingCode?: boolean;
  onCountryChange?: (country: CountryProfile, event: ChangeEvent<HTMLSelectElement>) => void;
}

export function getCountryOptions(
  language: CountryLabelLanguage = "en",
  countryCodes?: readonly ArabCountryCode[],
  includeCallingCode = false
): CountryOption[] {
  const allowed = countryCodes ? new Set(countryCodes) : null;

  return listCountries()
    .filter((country) => !allowed || allowed.has(country.code))
    .map((country) => {
      const name = language === "ar" ? country.nameAr : country.name;
      return {
        code: country.code,
        label: includeCallingCode ? `${name} (${country.callingCode})` : name,
        callingCode: country.callingCode,
        currency: country.defaultCurrency
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, language === "ar" ? "ar" : "en"));
}

export function CountrySelect({
  value,
  defaultValue,
  language = "en",
  countries,
  includeCallingCode = false,
  onCountryChange,
  dir,
  ...selectProps
}: CountrySelectProps) {
  const options = getCountryOptions(language, countries, includeCallingCode);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const country = listCountries().find((item) => item.code === event.currentTarget.value);
    if (country) onCountryChange?.(country, event);
  };

  return (
    <select
      {...selectProps}
      value={value}
      defaultValue={defaultValue}
      dir={dir ?? (language === "ar" ? "rtl" : "ltr")}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
