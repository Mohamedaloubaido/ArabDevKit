const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC_INDIC = "۰۱۲۳۴۵۶۷۸۹";

export function toLatinDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_INDIC.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(EASTERN_ARABIC_INDIC.indexOf(digit)));
}

export function toArabicIndicDigits(input: string | number): string {
  return String(input).replace(/\d/g, (digit) => ARABIC_INDIC[Number(digit)] ?? digit);
}
