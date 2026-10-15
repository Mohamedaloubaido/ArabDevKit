export type ArabCountryCode =
  | "DZ"
  | "BH"
  | "KM"
  | "DJ"
  | "EG"
  | "IQ"
  | "JO"
  | "KW"
  | "LB"
  | "LY"
  | "MR"
  | "MA"
  | "OM"
  | "PS"
  | "QA"
  | "SA"
  | "SO"
  | "SD"
  | "SY"
  | "TN"
  | "AE"
  | "YE";

export interface CountryProfile {
  code: ArabCountryCode;
  iso3: string;
  name: string;
  nameAr: string;
  callingCode: `+${string}`;
  defaultCurrency: string | null;
  currencies: readonly string[];
  locales: readonly string[];
}
