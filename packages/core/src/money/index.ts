import { getCountry, type ArabCountryCode } from "../countries/index.js";

export interface FormatMoneyOptions {
  locale?: string;
  currency?: string;
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
  const currency = options.currency ?? profile.defaultCurrency;

  if (!currency) {
    throw new Error(
      `${country} has no single default currency. Pass options.currency explicitly.`
    );
  }

  if (!profile.currencies.includes(currency)) {
    throw new RangeError(`${currency} is not configured as a supported currency for ${country}.`);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: options.currencyDisplay ?? "symbol",
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits
  }).format(amount);
}
