import type { CountryProfile } from "./types.js";

export const additionalCountries = {
  DZ: {
    code: "DZ", iso3: "DZA", name: "Algeria", nameAr: "الجزائر",
    callingCode: "+213", defaultCurrency: "DZD", currencies: ["DZD"], locales: ["ar-DZ", "en-DZ"]
  },
  BH: {
    code: "BH", iso3: "BHR", name: "Bahrain", nameAr: "البحرين",
    callingCode: "+973", defaultCurrency: "BHD", currencies: ["BHD"], locales: ["ar-BH", "en-BH"]
  },
  KM: {
    code: "KM", iso3: "COM", name: "Comoros", nameAr: "جزر القمر",
    callingCode: "+269", defaultCurrency: "KMF", currencies: ["KMF"], locales: ["ar-KM", "en-KM"]
  },
  DJ: {
    code: "DJ", iso3: "DJI", name: "Djibouti", nameAr: "جيبوتي",
    callingCode: "+253", defaultCurrency: "DJF", currencies: ["DJF"], locales: ["ar-DJ", "en-DJ"]
  },
  IQ: {
    code: "IQ", iso3: "IRQ", name: "Iraq", nameAr: "العراق",
    callingCode: "+964", defaultCurrency: "IQD", currencies: ["IQD"], locales: ["ar-IQ", "en-IQ"]
  },
  JO: {
    code: "JO", iso3: "JOR", name: "Jordan", nameAr: "الأردن",
    callingCode: "+962", defaultCurrency: "JOD", currencies: ["JOD"], locales: ["ar-JO", "en-JO"]
  },
  KW: {
    code: "KW", iso3: "KWT", name: "Kuwait", nameAr: "الكويت",
    callingCode: "+965", defaultCurrency: "KWD", currencies: ["KWD"], locales: ["ar-KW", "en-KW"]
  },
  LB: {
    code: "LB", iso3: "LBN", name: "Lebanon", nameAr: "لبنان",
    callingCode: "+961", defaultCurrency: "LBP", currencies: ["LBP"], locales: ["ar-LB", "en-LB"]
  },
  LY: {
    code: "LY", iso3: "LBY", name: "Libya", nameAr: "ليبيا",
    callingCode: "+218", defaultCurrency: "LYD", currencies: ["LYD"], locales: ["ar-LY", "en-LY"]
  },
  MR: {
    code: "MR", iso3: "MRT", name: "Mauritania", nameAr: "موريتانيا",
    callingCode: "+222", defaultCurrency: "MRU", currencies: ["MRU"], locales: ["ar-MR", "en-MR"]
  },
  MA: {
    code: "MA", iso3: "MAR", name: "Morocco", nameAr: "المغرب",
    callingCode: "+212", defaultCurrency: "MAD", currencies: ["MAD"], locales: ["ar-MA", "en-MA"]
  },
  OM: {
    code: "OM", iso3: "OMN", name: "Oman", nameAr: "عُمان",
    callingCode: "+968", defaultCurrency: "OMR", currencies: ["OMR"], locales: ["ar-OM", "en-OM"]
  },
  PS: {
    code: "PS", iso3: "PSE", name: "Palestine", nameAr: "فلسطين",
    callingCode: "+970", defaultCurrency: null, currencies: ["ILS", "USD", "JOD", "EUR"], locales: ["ar-PS", "en-PS"]
  },
  QA: {
    code: "QA", iso3: "QAT", name: "Qatar", nameAr: "قطر",
    callingCode: "+974", defaultCurrency: "QAR", currencies: ["QAR"], locales: ["ar-QA", "en-QA"]
  },
  SO: {
    code: "SO", iso3: "SOM", name: "Somalia", nameAr: "الصومال",
    callingCode: "+252", defaultCurrency: "SOS", currencies: ["SOS"], locales: ["ar-SO", "en-SO"]
  },
  SD: {
    code: "SD", iso3: "SDN", name: "Sudan", nameAr: "السودان",
    callingCode: "+249", defaultCurrency: "SDG", currencies: ["SDG"], locales: ["ar-SD", "en-SD"]
  },
  TN: {
    code: "TN", iso3: "TUN", name: "Tunisia", nameAr: "تونس",
    callingCode: "+216", defaultCurrency: "TND", currencies: ["TND"], locales: ["ar-TN", "en-TN"]
  },
  YE: {
    code: "YE", iso3: "YEM", name: "Yemen", nameAr: "اليمن",
    callingCode: "+967", defaultCurrency: "YER", currencies: ["YER"], locales: ["ar-YE", "en-YE"]
  }
} as const satisfies Partial<Record<string, CountryProfile>>;
