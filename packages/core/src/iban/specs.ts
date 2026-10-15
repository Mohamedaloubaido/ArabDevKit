export type ArabIbanCountryCode =
  | "AE"
  | "BH"
  | "DJ"
  | "EG"
  | "IQ"
  | "JO"
  | "KW"
  | "LB"
  | "LY"
  | "MR"
  | "OM"
  | "PS"
  | "QA"
  | "SA"
  | "SD"
  | "SO"
  | "TN"
  | "YE";

export interface IbanFieldPosition {
  /** 1-based position within the BBAN. */
  start: number;
  length: number;
}

export interface ArabIbanSpec {
  countryCode: ArabIbanCountryCode;
  ibanLength: number;
  bbanLength: number;
  /** SWIFT registry notation, e.g. `4!a4!n18!c`. */
  bbanStructure: string;
  /** Regex source for the BBAN only. */
  bbanPattern: string;
  bankIdentifier: IbanFieldPosition;
  branchIdentifier?: IbanFieldPosition;
  example: string;
}

/**
 * ISO 13616 country formats for Arab markets that publish an IBAN format.
 *
 * Source of truth: SWIFT IBAN Registry (Registration Authority for ISO 13616).
 * The registry is versioned independently from ArabDevKit; keep this table
 * source-backed and update it only from a published SWIFT registry revision.
 */
export const ARAB_IBAN_SPECS = {
  AE: {
    countryCode: "AE", ibanLength: 23, bbanLength: 19,
    bbanStructure: "3!n16!n", bbanPattern: "[0-9]{19}",
    bankIdentifier: { start: 1, length: 3 },
    example: "AE070331234567890123456"
  },
  BH: {
    countryCode: "BH", ibanLength: 22, bbanLength: 18,
    bbanStructure: "4!a14!c", bbanPattern: "[A-Z]{4}[A-Z0-9]{14}",
    bankIdentifier: { start: 1, length: 4 },
    example: "BH67BMAG00001299123456"
  },
  DJ: {
    countryCode: "DJ", ibanLength: 27, bbanLength: 23,
    bbanStructure: "5!n5!n11!n2!n", bbanPattern: "[0-9]{23}",
    bankIdentifier: { start: 1, length: 5 }, branchIdentifier: { start: 6, length: 5 },
    example: "DJ2100010000000154000100186"
  },
  EG: {
    countryCode: "EG", ibanLength: 29, bbanLength: 25,
    bbanStructure: "4!n4!n17!n", bbanPattern: "[0-9]{25}",
    bankIdentifier: { start: 1, length: 4 }, branchIdentifier: { start: 5, length: 4 },
    example: "EG380019000500000000263180002"
  },
  IQ: {
    countryCode: "IQ", ibanLength: 23, bbanLength: 19,
    bbanStructure: "4!a3!n12!n", bbanPattern: "[A-Z]{4}[0-9]{15}",
    bankIdentifier: { start: 1, length: 4 }, branchIdentifier: { start: 5, length: 3 },
    example: "IQ98NBIQ850123456789012"
  },
  JO: {
    countryCode: "JO", ibanLength: 30, bbanLength: 26,
    bbanStructure: "4!a4!n18!c", bbanPattern: "[A-Z]{4}[0-9]{4}[A-Z0-9]{18}",
    bankIdentifier: { start: 1, length: 4 }, branchIdentifier: { start: 5, length: 4 },
    example: "JO94CBJO0010000000000131000302"
  },
  KW: {
    countryCode: "KW", ibanLength: 30, bbanLength: 26,
    bbanStructure: "4!a22!c", bbanPattern: "[A-Z]{4}[A-Z0-9]{22}",
    bankIdentifier: { start: 1, length: 4 },
    example: "KW81CBKU0000000000001234560101"
  },
  LB: {
    countryCode: "LB", ibanLength: 28, bbanLength: 24,
    bbanStructure: "4!n20!c", bbanPattern: "[0-9]{4}[A-Z0-9]{20}",
    bankIdentifier: { start: 1, length: 4 },
    example: "LB62099900000001001901229114"
  },
  LY: {
    countryCode: "LY", ibanLength: 25, bbanLength: 21,
    bbanStructure: "3!n3!n15!n", bbanPattern: "[0-9]{21}",
    bankIdentifier: { start: 1, length: 3 }, branchIdentifier: { start: 4, length: 3 },
    example: "LY83002048000020100120361"
  },
  MR: {
    countryCode: "MR", ibanLength: 27, bbanLength: 23,
    bbanStructure: "5!n5!n11!n2!n", bbanPattern: "[0-9]{23}",
    bankIdentifier: { start: 1, length: 5 }, branchIdentifier: { start: 6, length: 5 },
    example: "MR1300020001010000123456753"
  },
  OM: {
    countryCode: "OM", ibanLength: 23, bbanLength: 19,
    bbanStructure: "3!n16!c", bbanPattern: "[0-9]{3}[A-Z0-9]{16}",
    bankIdentifier: { start: 1, length: 3 },
    example: "OM810180000001299123456"
  },
  PS: {
    countryCode: "PS", ibanLength: 29, bbanLength: 25,
    bbanStructure: "4!a21!c", bbanPattern: "[A-Z]{4}[A-Z0-9]{21}",
    bankIdentifier: { start: 1, length: 4 },
    example: "PS92PALS000000000400123456702"
  },
  QA: {
    countryCode: "QA", ibanLength: 29, bbanLength: 25,
    bbanStructure: "4!a21!c", bbanPattern: "[A-Z]{4}[A-Z0-9]{21}",
    bankIdentifier: { start: 1, length: 4 },
    example: "QA58DOHB00001234567890ABCDEFG"
  },
  SA: {
    countryCode: "SA", ibanLength: 24, bbanLength: 20,
    bbanStructure: "2!n18!c", bbanPattern: "[0-9]{2}[A-Z0-9]{18}",
    bankIdentifier: { start: 1, length: 2 },
    example: "SA0380000000608010167519"
  },
  SD: {
    countryCode: "SD", ibanLength: 18, bbanLength: 14,
    bbanStructure: "2!n12!n", bbanPattern: "[0-9]{14}",
    bankIdentifier: { start: 1, length: 2 },
    example: "SD2129010501234001"
  },
  SO: {
    countryCode: "SO", ibanLength: 23, bbanLength: 19,
    bbanStructure: "4!n3!n12!n", bbanPattern: "[0-9]{19}",
    bankIdentifier: { start: 1, length: 4 }, branchIdentifier: { start: 5, length: 3 },
    example: "SO211000001001000100141"
  },
  TN: {
    countryCode: "TN", ibanLength: 24, bbanLength: 20,
    bbanStructure: "2!n3!n13!n2!n", bbanPattern: "[0-9]{20}",
    bankIdentifier: { start: 1, length: 2 }, branchIdentifier: { start: 3, length: 3 },
    example: "TN5910006035183598478831"
  },
  YE: {
    countryCode: "YE", ibanLength: 30, bbanLength: 26,
    bbanStructure: "4!a4!n18!c", bbanPattern: "[A-Z]{4}[0-9]{4}[A-Z0-9]{18}",
    bankIdentifier: { start: 1, length: 4 }, branchIdentifier: { start: 5, length: 4 },
    example: "YE15CBYE0001018861234567891234"
  }
} as const satisfies Record<ArabIbanCountryCode, ArabIbanSpec>;

export function isArabIbanCountryCode(value: string): value is ArabIbanCountryCode {
  return Object.prototype.hasOwnProperty.call(ARAB_IBAN_SPECS, value.toUpperCase());
}

export function getArabIbanSpec(country: ArabIbanCountryCode): ArabIbanSpec {
  return ARAB_IBAN_SPECS[country];
}

export function listArabIbanSpecs(): ArabIbanSpec[] {
  return Object.values(ARAB_IBAN_SPECS);
}
