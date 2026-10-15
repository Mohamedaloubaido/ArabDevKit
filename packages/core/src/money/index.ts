import { getCountry, type ArabCountryCode } from "../countries/index.js";

export interface FormatMoneyOptions {
  locale?: string;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatMoney(
  amount: number,
  country: ArabCountryCode,
  options: FormatMoneyOptions = {}
): string {
  const profile = getCountry(country);
  const locale = options.locale ?? profile.locales[0] ?? "ar";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: profile.currency,
    currencyDisplay: options.currencyDisplay ?? "symbol",
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits
  }).format(amount);
}
