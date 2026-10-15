import examples from "libphonenumber-js/mobile/examples";
import { getExampleNumber, type CountryCode } from "libphonenumber-js";
import {
  createIban,
  formatPhoneE164,
  formatPhoneNational,
  getArabIbanSpec,
  getCountry,
  isArabIbanCountryCode,
  isValidPhone,
  type ArabCountryCode,
  type ArabIbanCountryCode
} from "@arabdevkit/core";
import { COMPANY_WORDS, COUNTRY_DATA, NAME_POOLS, STREET_NAMES } from "./data.js";
import { SeededRandom } from "./random.js";

export type FakerGender = "male" | "female";

export interface ArabFakerOptions {
  seed?: number;
}

export interface FakePerson {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: FakerGender;
  countryCode: ArabCountryCode;
}

export interface FakeAddress {
  line1: string;
  city: string;
  country: string;
  countryAr: string;
  countryCode: ArabCountryCode;
}

export interface FakeCompany {
  name: string;
  city: string;
  countryCode: ArabCountryCode;
}

export interface FakePhone {
  national: string;
  e164: string;
  countryCode: ArabCountryCode;
  synthetic: true;
}

export interface FakeIban {
  iban: string;
  formatted: string;
  countryCode: ArabIbanCountryCode;
  synthetic: true;
}

function generateBban(country: ArabIbanCountryCode, random: SeededRandom): string {
  const structure = getArabIbanSpec(country).bbanStructure;
  const tokens = [...structure.matchAll(/(\d+)!([anc])/g)];
  if (tokens.length === 0) throw new Error(`Unsupported BBAN structure: ${structure}`);

  return tokens.map(([, countRaw, kind]) => {
    const count = Number(countRaw);
    if (kind === "a") return random.letters(count);
    if (kind === "n") return random.digits(count);
    return random.alphanumeric(count);
  }).join("");
}

function mutateExamplePhone(country: ArabCountryCode, random: SeededRandom): FakePhone | null {
  const example = getExampleNumber(country as CountryCode, examples);
  if (!example) return null;

  const base = example.nationalNumber;
  const mutableDigits = Math.min(4, Math.max(1, base.length - 2));
  const prefix = base.slice(0, -mutableDigits);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = `${prefix}${random.digits(mutableDigits)}`;
    if (!isValidPhone(candidate, country)) continue;
    const e164 = formatPhoneE164(candidate, country);
    const national = formatPhoneNational(candidate, country);
    if (e164 && national) return { national, e164, countryCode: country, synthetic: true };
  }

  const fallbackE164 = formatPhoneE164(example.number, country);
  const fallbackNational = formatPhoneNational(example.number, country);
  if (!fallbackE164 || !fallbackNational) return null;
  return { national: fallbackNational, e164: fallbackE164, countryCode: country, synthetic: true };
}

export interface ArabFaker {
  person(gender?: FakerGender): FakePerson;
  address(): FakeAddress;
  company(): FakeCompany;
  phone(): FakePhone | null;
  iban(): FakeIban | null;
}

export function createArabFaker(countryCode: ArabCountryCode, options: ArabFakerOptions = {}): ArabFaker {
  const random = new SeededRandom(options.seed);
  const profile = getCountry(countryCode);
  const data = COUNTRY_DATA[countryCode];
  const names = NAME_POOLS[data.region];

  return {
    person(gender = random.pick(["male", "female"] as const)): FakePerson {
      const firstName = random.pick(names[gender]);
      const lastName = random.pick(names.family);
      return {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        gender,
        countryCode
      };
    },

    address(): FakeAddress {
      const city = random.pick(data.cities);
      const line1 = `مبنى ${random.int(1, 240)}، شارع ${random.pick(STREET_NAMES)}`;
      return {
        line1,
        city,
        country: profile.name,
        countryAr: profile.nameAr,
        countryCode
      };
    },

    company(): FakeCompany {
      return {
        name: `${random.pick(COMPANY_WORDS.prefix)} ${random.pick(COMPANY_WORDS.activity)}`,
        city: random.pick(data.cities),
        countryCode
      };
    },

    phone(): FakePhone | null {
      return mutateExamplePhone(countryCode, random);
    },

    iban(): FakeIban | null {
      if (!isArabIbanCountryCode(countryCode)) return null;
      const bban = generateBban(countryCode, random);
      const iban = createIban(countryCode, bban);
      if (!iban) return null;
      return {
        iban,
        formatted: iban.replace(/(.{4})(?=.)/g, "$1 "),
        countryCode,
        synthetic: true
      };
    }
  };
}

export const faker = {
  dz: createArabFaker("DZ"), bh: createArabFaker("BH"), km: createArabFaker("KM"),
  dj: createArabFaker("DJ"), eg: createArabFaker("EG"), iq: createArabFaker("IQ"),
  jo: createArabFaker("JO"), kw: createArabFaker("KW"), lb: createArabFaker("LB"),
  ly: createArabFaker("LY"), mr: createArabFaker("MR"), ma: createArabFaker("MA"),
  om: createArabFaker("OM"), ps: createArabFaker("PS"), qa: createArabFaker("QA"),
  sa: createArabFaker("SA"), so: createArabFaker("SO"), sd: createArabFaker("SD"),
  sy: createArabFaker("SY"), tn: createArabFaker("TN"), ae: createArabFaker("AE"),
  ye: createArabFaker("YE")
} as const;

export { COUNTRY_DATA } from "./data.js";
export { SeededRandom } from "./random.js";
